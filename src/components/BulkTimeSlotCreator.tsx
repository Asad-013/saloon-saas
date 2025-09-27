import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Staff {
  id: string;
  name: string;
}

interface BulkTimeSlotCreatorProps {
  staff: Staff[];
  onCreateSlots: (staffId: string, startDate: string, endDate: string, times: string[]) => Promise<void>;
}

const BulkTimeSlotCreator = ({ staff, onCreateSlots }: BulkTimeSlotCreatorProps) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const handleTimeToggle = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedTimes(prev => [...prev, time]);
    } else {
      setSelectedTimes(prev => prev.filter(t => t !== time));
    }
  };

  const selectAllTimes = () => {
    setSelectedTimes(timeSlots);
  };

  const clearAllTimes = () => {
    setSelectedTimes([]);
  };

  const handleSubmit = async () => {
    if (!selectedStaff || !startDate || !endDate || selectedTimes.length === 0) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateSlots(selectedStaff, startDate, endDate, selectedTimes);
      // Reset form
      setSelectedStaff("");
      setStartDate("");
      setEndDate("");
      setSelectedTimes([]);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bulk-staff">Staff Member</Label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Time Slots</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllTimes}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllTimes}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {timeSlots.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <Checkbox
                  id={time}
                  checked={selectedTimes.includes(time)}
                  onCheckedChange={(checked) => handleTimeToggle(time, checked as boolean)}
                />
                <Label htmlFor={time} className="text-sm">
                  {time}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!selectedStaff || !startDate || !endDate || selectedTimes.length === 0 || isCreating}
        >
          {isCreating ? "Creating..." : `Create ${selectedTimes.length} slots`}
        </Button>
      </div>
    </div>
  );
};

export default BulkTimeSlotCreator;