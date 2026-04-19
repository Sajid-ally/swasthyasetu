const PermissionRow = ({ person }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
      <div>
        <p className="font-medium text-white">{person.name}</p>
        <p className="text-sm text-muted">{person.relation}</p>
      </div>

      <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
        {person.access}
      </span>
    </div>
  );
};

export default PermissionRow;