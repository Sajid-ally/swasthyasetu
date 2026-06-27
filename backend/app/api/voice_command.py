from fastapi import APIRouter, UploadFile, File, Query
import tempfile
import os
import speech_recognition as sr

from app.api.assistant_command import assistant_command

router = APIRouter(prefix="/voice-command", tags=["Voice Command"])


@router.post("/{user_id}")
async def voice_command(
    user_id: str,
    audio: UploadFile = File(...),
    language: str = Query(default="en-IN")
):
    if not audio:
        return {
            "success": False,
            "message": "No audio file received."
        }

    temp_path = None

    try:
        audio_bytes = await audio.read()

        if not audio_bytes:
            return {
                "success": False,
                "message": "Empty audio file received."
            }

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        recognizer = sr.Recognizer()

        with sr.AudioFile(temp_path) as source:
            audio_data = recognizer.record(source)

        try:
            transcript = recognizer.recognize_google(
                audio_data,
                language=language
            )
        except sr.UnknownValueError:
            return {
                "success": False,
                "message": "Could not understand the audio. Please speak clearly.",
                "transcript": ""
            }
        except sr.RequestError:
            return {
                "success": False,
                "message": "Speech service failed. Check internet connection.",
                "transcript": ""
            }

        command_result = assistant_command(user_id, {"text": transcript})

        return {
            "success": True,
            "message": "Voice command processed successfully.",
            "transcript": transcript,
            "command_result": command_result,
            "navigate_to": command_result.get("navigate_to")
            if isinstance(command_result, dict)
            else None
        }

    except Exception as error:
        return {
            "success": False,
            "message": f"Voice command failed: {str(error)}",
            "transcript": ""
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)