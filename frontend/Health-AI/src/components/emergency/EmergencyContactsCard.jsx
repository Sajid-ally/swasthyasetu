import { Phone, Users } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";

const EmergencyContactsCard = ({ contacts = [] }) => {
  return (
    <SectionCard
      title="Emergency Contacts"
      subtitle="Priority contacts for urgent situations"
      icon={Users}
    >
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No emergency contacts available.
          </div>
        ) : (
          contacts.map((contact, index) => (
            <div
              key={contact.id || index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:bg-white/10"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {contact.name || "Unknown Contact"}
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {contact.relation || "Relation not specified"}
                  </p>
                </div>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Priority {contact.priority || index + 1}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {contact.phone && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {contact.phone}
                  </span>
                )}
                {contact.altPhone && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Alt: {contact.altPhone}
                  </span>
                )}
              </div>

              <ActionButton variant="secondary">
                <Phone size={16} />
                Call Contact
              </ActionButton>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default EmergencyContactsCard;