import SmartAddButton from "./SmartAddButton";

const AIActionBar = ({ onSmartAdd, isSubmitting = false }) => {
  return (
    <div className="space-y-4">
      <SmartAddButton onSubmit={onSmartAdd} isLoading={isSubmitting} />
    </div>
  );
};

export default AIActionBar;