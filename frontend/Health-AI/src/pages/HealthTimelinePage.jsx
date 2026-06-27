import { useEffect, useMemo, useState } from "react";
import { History, ActivitySquare, CalendarClock } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import TimelineFilters from "../components/timeline/TimelineFilters";
import TimelineStats from "../components/timeline/TimelineStats";
import TimelineList from "../components/timeline/TimelineList";
import AddEventModal from "../components/timeline/AddEventModal";
import InfoBadge from "../components/common/InfoBadge";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

import { getTimelineData } from "../services/timelineService";

const HealthTimelinePage = () => {
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

  // ✅ FIXED FETCH
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const data = await getTimelineData();

        // 🔥 FIX HERE (timeline instead of events)
        const formatted = (data?.timeline || []).map((e, index) => ({
          id: index,
          title: e.title,
          type: e.type,
          date: e.date,
          time: e.time,
          doctor: e.doctor,
          location: e.location,
          description: e.notes || "",
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Timeline fetch failed:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // 🔹 Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        [
          event.title,
          event.description,
          event.doctor,
          event.location,
          event.date,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        selectedType === "all" ? true : event.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [events, search, selectedType]);

  // 🔹 Stats
  const stats = useMemo(() => {
    return {
      totalEvents: filteredEvents.length,
      checkups: filteredEvents.filter((e) => e.type === "checkup").length,
      reports: filteredEvents.filter((e) => e.type === "report").length,
      alerts: filteredEvents.filter((e) => e.type === "alert").length,
    };
  }, [filteredEvents]);

  // 🔹 Modal handlers
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

  // ✅ FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.type) return;

    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      date: formData.date
        ? new Date(formData.date).toISOString().split("T")[0]
        : "",
      time: formData.time,
      doctor: formData.doctor,
      location: formData.location,
      notes: formData.description,
    };

    try {
      await fetch(`http://localhost:8000/timeline/user_1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 🔥 REFETCH + FORMAT AGAIN
      const data = await getTimelineData();

      const formatted = (data?.timeline || []).map((e, index) => ({
        id: index,
        title: e.title,
        type: e.type,
        date: e.date,
        time: e.time,
        doctor: e.doctor,
        location: e.location,
        description: e.notes || "",
      }));

      setEvents(formatted);

      handleCloseModal();
    } catch (error) {
      console.error("Error saving timeline event:", error);
    }
  };

  // 🔹 Loading
  if (isLoading) {
    return (
      <PageContainer
        title="Health Timeline"
        subtitle="Track health events, reports, and changes across time"
      >
        <Loader />
      </PageContainer>
    );
  }

  // 🔹 Error
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

        {/* HEADER */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
                <History size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Personal Health Timeline
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Review checkups, reports, alerts, and routine events.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${events.length} Events Recorded`}
                    variant="primary"
                  />
                  <InfoBadge label="Timeline Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <ActivitySquare size={16} />
                  <span className="text-xs">Status</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Records organized
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <CalendarClock size={16} />
                  <span className="text-xs">Latest Update</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Timeline active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TimelineFilters
          search={search}
          selectedType={selectedType}
          selectedRange={selectedRange}
          onSearchChange={(e) => setSearch(e.target.value)}
          onTypeChange={(e) => setSelectedType(e.target.value)}
          onRangeChange={(e) => setSelectedRange(e.target.value)}
        />

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Add Event
          </button>
        </div>

        <TimelineStats stats={stats} />
        <TimelineList events={filteredEvents} />

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