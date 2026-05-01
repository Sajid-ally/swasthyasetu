import os
import re
import tempfile
from PIL import Image, ImageOps, ImageFilter
import pytesseract
import fitz  # PyMuPDF


# Common Windows install path
DEFAULT_TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(DEFAULT_TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = DEFAULT_TESSERACT_PATH


def preprocess_image(image_path: str) -> Image.Image:
    """
    Basic preprocessing for medicine strips/reports:
    - grayscale
    - auto contrast
    - sharpen
    """
    image = Image.open(image_path)

    if image.mode != "RGB":
        image = image.convert("RGB")

    image = ImageOps.grayscale(image)
    image = ImageOps.autocontrast(image)
    image = image.filter(ImageFilter.SHARPEN)

    return image


def clean_ocr_text(text: str) -> str:
    text = text or ""
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_text_from_image_bytes(image_bytes: bytes, suffix: str = ".png") -> dict:
    """
    Takes uploaded image bytes and returns OCR text.
    Used for medicine images and report images.
    """
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(image_bytes)
            temp_path = temp_file.name

        processed_image = preprocess_image(temp_path)

        raw_text = pytesseract.image_to_string(
            processed_image,
            config="--psm 6"
        )

        cleaned_text = clean_ocr_text(raw_text)

        if not cleaned_text:
            return {
                "success": False,
                "text": "",
                "ocr_text": "",
                "message": "No readable text detected in image."
            }

        return {
            "success": True,
            "text": cleaned_text,
            "ocr_text": cleaned_text,
            "message": "OCR text extracted successfully."
        }

    except pytesseract.pytesseract.TesseractNotFoundError:
        return {
            "success": False,
            "text": "",
            "ocr_text": "",
            "message": "Tesseract OCR is not installed or path is not configured."
        }

    except Exception as error:
        return {
            "success": False,
            "text": "",
            "ocr_text": "",
            "message": f"OCR failed: {str(error)}"
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


def extract_text_from_pdf_bytes(pdf_bytes: bytes, max_pages: int = 3) -> dict:
    """
    Extracts text from PDF.

    Flow:
    1. Try direct PDF text extraction.
    2. If direct text is weak/empty, render PDF pages as images and OCR them.

    max_pages is limited for demo speed.
    """
    temp_pdf_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(pdf_bytes)
            temp_pdf_path = temp_pdf.name

        doc = fitz.open(temp_pdf_path)

        direct_text_parts = []

        total_pages = min(len(doc), max_pages)

        for page_index in range(total_pages):
            page = doc[page_index]
            page_text = page.get_text("text")
            if page_text:
                direct_text_parts.append(page_text)

        direct_text = clean_ocr_text(" ".join(direct_text_parts))

        # If PDF already has selectable text, use it.
        if len(direct_text) > 40:
            doc.close()
            return {
                "success": True,
                "text": direct_text,
                "ocr_text": direct_text,
                "message": "PDF text extracted successfully."
            }

        # Otherwise OCR rendered pages.
        ocr_text_parts = []

        for page_index in range(total_pages):
            page = doc[page_index]

            # Higher zoom = better OCR, but slower.
            matrix = fitz.Matrix(2, 2)
            pix = page.get_pixmap(matrix=matrix)

            temp_img_path = None

            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_img:
                    pix.save(temp_img.name)
                    temp_img_path = temp_img.name

                processed_image = preprocess_image(temp_img_path)

                page_ocr_text = pytesseract.image_to_string(
                    processed_image,
                    config="--psm 6"
                )

                if page_ocr_text:
                    ocr_text_parts.append(page_ocr_text)

            finally:
                if temp_img_path and os.path.exists(temp_img_path):
                    os.remove(temp_img_path)

        doc.close()

        final_text = clean_ocr_text(" ".join(ocr_text_parts))

        if not final_text:
            return {
                "success": False,
                "text": "",
                "ocr_text": "",
                "message": "No readable text detected in PDF."
            }

        return {
            "success": True,
            "text": final_text,
            "ocr_text": final_text,
            "message": "PDF OCR text extracted successfully."
        }

    except pytesseract.pytesseract.TesseractNotFoundError:
        return {
            "success": False,
            "text": "",
            "ocr_text": "",
            "message": "Tesseract OCR is not installed or path is not configured."
        }

    except Exception as error:
        return {
            "success": False,
            "text": "",
            "ocr_text": "",
            "message": f"PDF text extraction failed: {str(error)}"
        }

    finally:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)


def extract_text_from_upload_bytes(file_bytes: bytes, filename: str = "") -> dict:
    """
    Universal extractor:
    - image files -> image OCR
    - pdf files -> PDF text/OCR
    """
    filename = filename or ""
    lower_name = filename.lower()

    if lower_name.endswith(".pdf"):
        return extract_text_from_pdf_bytes(file_bytes)

    suffix = ".png"

    if "." in filename:
        suffix = "." + filename.split(".")[-1].lower()

    return extract_text_from_image_bytes(file_bytes, suffix=suffix)