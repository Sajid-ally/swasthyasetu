import { useEffect, useMemo, useState } from "react";
import {
  History,
  ActivitySquare,
  CalendarClock,
  Plus,
  RefreshCcw,
  FileText,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import TimelineFilters from "../components/timeline/TimelineFilters";
import TimelineStats from "../components/timeline/TimelineStats";
import TimelineList from "../components/timeline/TimelineList";
import AddEventModal from "../components/timeline/AddEventModal";
import InfoBadge from "../components/common/InfoBadge";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";

import {
  getTimelineData,
  addTimelineEvent,
  deleteTimelineEvent,
} from "../services/timelineService";

import { useUser } from "../context/UserContext";

const getEventDateValue = (event = {}) => {
  return event.created_at || event.date || "";
};

const formatLatestDate = (value) => {
  if (!value) return "No records yet";

  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recently updated";
  }
};

const getSafeEventId = (event = {}) => {
  return event.id || `legacy_event_${event._timeline_index}`;
};

const HealthTimelinePage = () => {
  const { userId, user } = useUser();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRange, setSelectedRange] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    doctor: "",
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState("");

  const fetchTimeline = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setHasError(false);

      const data = await getTimelineData(userId, selectedType, selectedRange);

      // Keep full event object.
      // Do not map/format here, otherwise report fields like
      // key_findings, source, created_at, disclaimer will be lost.
      setEvents(data?.timeline || []);
    } catch (error) {
      console.error("Timeline fetch failed:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();

    const refreshHandler = () => fetchTimeline();

    window.addEventListener("smart-add-updated", refreshHandler);
    window.addEventListener("assistant-command-updated", refreshHandler);
    window.addEventListener("timeline-updated", refreshHandler);

    return () => {
      window.removeEventListener("smart-add-updated", refreshHandler);
      window.removeEventListener("assistant-command-updated", refreshHandler);
      window.removeEventListener("timeline-updated", refreshHandler);
    };
  }, [userId, selectedType, selectedRange]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchableText = [
        event.title,
        event.type,
        event.report_type,
        event.summary,
        event.suggestion,
        event.notes,
        event.description,
        event.doctor,
        event.location,
        event.source,
        event.disclaimer,
        event.date,
        event.created_at,
        ...(event.possible_attention_points || []),
        ...(event.key_findings || []).map((finding) =>
          [
            finding.name,
            finding.value,
            finding.unit,
            finding.status,
            finding.note,
          ].join(" ")
        ),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [events, search]);

  const latestUpdate = useMemo(() => {
    if (!events.length) return "No records yet";

    const sortedEvents = [...events].sort((a, b) => {
      return new Date(getEventDateValue(b)) - new Date(getEventDateValue(a));
    });

    return formatLatestDate(getEventDateValue(sortedEvents[0]));
  }, [events]);

  const stats = useMemo(() => {
    const reportEvents = filteredEvents.filter(
      (event) => event.type === "medical_report" || event.type === "report"
    );

    const medicineEvents = filteredEvents.filter(
      (event) => event.type === "medication" || event.type === "medicine"
    );

    const routineEvents = filteredEvents.filter(
      (event) => event.type === "routine"
    );

    const attentionCount = filteredEvents.reduce((count, event) => {
      const directPoints = event.possible_attention_points?.length || 0;

      const abnormalFindings =
        event.key_findings?.filter((finding) => {
          const status = String(finding.status || "").toLowerCase();
          return status && !["normal", "unknown"].includes(status);
        }).length || 0;

      return count + directPoints + abnormalFindings;
    }, 0);

    return {
      totalEvents: filteredEvents.length,
      reports: reportEvents.length,
      medicines: medicineEvents.length,
      routine: routineEvents.length,
      alerts: attentionCount,
    };
  }, [filteredEvents]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      type: "",
      date: "",
      time: "",
      doctor: "",
      location: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.type || !userId) return;

    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      date: formData.date || new Date().toISOString().split("T")[0],
      time: formData.time,
      doctor: formData.doctor,
      location: formData.location,
      description: formData.description,
      source: "manual",
    };

    try {
      await addTimelineEvent(userId, payload);
      await fetchTimeline();
      handleCloseModal();

      window.dispatchEvent(new Event("timeline-updated"));
      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
    } catch (error) {
      console.error("Error saving timeline event:", error);
      alert("Could not save event. Please try again.");
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!event || !userId) return;

    const eventId = getSafeEventId(event);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this timeline event?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingEventId(eventId);

      const res = await deleteTimelineEvent(userId, eventId);

      if (!res?.success) {
        alert(res?.message || "Could not delete event.");
        return;
      }

      await fetchTimeline();

      window.dispatchEvent(new Event("timeline-updated"));
      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
    } catch (error) {
      console.error("Delete timeline event failed:", error);
      alert("Delete failed. Please try again.");
    } finally {
      setDeletingEventId("");
    }
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Health Timeline"
        subtitle="Track health events, reports, and changes across time"
      >
        <Loader text="Loading timeline..." />
      </PageContainer>
    );
  }

  if (hasError) {
    return (
      <PageContainer
        title="Health Timeline"
        subtitle="Track health events, reports, and changes across time"
      >
        <ErrorState
          title="Unable to load timeline"
          message="Please check if backend server is running."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Health Timeline"
      subtitle="Track health events, reports, and changes across time"
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                <History size={28} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <FileText size={13} />
                  Health records connected
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Personal Health Timeline
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Review medical reports, medicine updates, routine logs, alerts,
                  and other health events in one professional timeline.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${events.length} Events Recorded`}
                    variant="primary"
                  />
                  <InfoBadge
                    label={
                      user?.name ? `${user.name}'s Records` : "Timeline Active"
                    }
                    variant="success"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <ActivitySquare size={16} />
                  <span className="text-xs">Status</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Records organized
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <CalendarClock size={16} />
                  <span className="text-xs">Latest Update</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {latestUpdate}
                </p>
              </div>
            </div>
          </div>
        </section>

        <TimelineStats stats={stats} />

        <TimelineFilters
          search={search}
          selectedType={selectedType}
          selectedRange={selectedRange}
          onSearchChange={(e) => setSearch(e.target.value)}
          onTypeChange={(e) => setSelectedType(e.target.value)}
          onRangeChange={(e) => setSelectedRange(e.target.value)}
        />

        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={fetchTimeline}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryLight"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>

        <TimelineList
          events={filteredEvents}
          onDelete={handleDeleteEvent}
          deletingEventId={deletingEventId}
        />

        <AddEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleChange}
        />
      </div>
    </PageContainer>
  );
};

export default HealthTimelinePage;