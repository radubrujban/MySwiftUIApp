import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMissionStore } from "@/lib/mission-store";

const formSchema = z.object({
  missionNumber: z.string().min(1, "Mission name is required"),
  missionType: z.string().min(1, "Mission type is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pax: z.number().min(0).default(0),
  cargo: z.number().min(0).default(0),
  legs: z.number().min(1).default(1),
  aircraftType: z.string().optional(),
});

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewMissionModal({ isOpen, onClose }: NewMissionModalProps) {
  const { toast } = useToast();
  const { addMission } = useMissionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      missionNumber: "",
      missionType: "",
      startDate: "",
      endDate: "",
      pax: 0,
      cargo: 0,
      legs: 1,
      aircraftType: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Create mission via API
      const missionData = {
        name: data.missionNumber,
        type: data.missionType,
        status: "Planning",
      };

      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
      });

      if (response.ok) {
        const createdMission = await response.json();
        
        // Convert API response to store format
        const newMission = {
          id: createdMission.id,
          missionNumber: data.missionNumber,
          missionType: data.missionType,
          status: "Planning" as const,
          dateRange: data.startDate && data.endDate 
            ? `${new Date(data.startDate!).toLocaleDateString()} - ${new Date(data.endDate!).toLocaleDateString()}`
            : 'TBD',
          legs: data.legs,
          pax: data.pax,
          cargo: data.cargo,
          aircraftType: data.aircraftType || undefined,
          createdAt: createdMission.createdAt,
        };

        addMission(newMission);
        
        toast({
          title: "Mission Created",
          description: "Your new mission has been added to the mission list.",
        });
        
        form.reset();
        onClose();
      } else {
        throw new Error('Failed to create mission');
      }
    } catch (error) {
      console.error('Error creating mission:', error);
      toast({
        title: "Error",
        description: "Failed to create mission. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aviation-surface border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="aviation-text">Create New Mission</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="missionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aviation-text">Mission Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="e.g., Operation Desert Shield"
                      className="aviation-card border-gray-600 aviation-text placeholder:text-gray-400"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="missionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aviation-text">Mission Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="aviation-card border-gray-600 aviation-text">
                        <SelectValue placeholder="Select mission type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="aviation-surface border-gray-600">
                      <SelectItem value="TDY" className="text-white hover:bg-slate-700">TDY</SelectItem>
                      <SelectItem value="Deployment" className="text-white hover:bg-slate-700">Deployment</SelectItem>
                      <SelectItem value="Training" className="text-white hover:bg-slate-700">Training</SelectItem>
                      <SelectItem value="Exercise" className="text-white hover:bg-slate-700">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="aviation-text">Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="date"
                        className="aviation-card border-gray-600 aviation-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="aviation-text">End Date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="date"
                        className="aviation-card border-gray-600 aviation-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Additional Mission Details */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="aviation-text">PAX</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="aviation-card border-gray-600 aviation-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="aviation-text">Cargo (lbs)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="aviation-card border-gray-600 aviation-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="aviation-text">Legs</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="aviation-card border-gray-600 aviation-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="aircraftType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aviation-text">Aircraft Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="aviation-card border-gray-600 aviation-text">
                        <SelectValue placeholder="Select aircraft type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="aviation-surface border-gray-600">
                      <SelectItem value="C-17A" className="text-white hover:bg-slate-700">C-17A</SelectItem>
                      <SelectItem value="C-5M" className="text-white hover:bg-slate-700">C-5M</SelectItem>
                      <SelectItem value="C-130J" className="text-white hover:bg-slate-700">C-130J</SelectItem>
                      <SelectItem value="KC-135" className="text-white hover:bg-slate-700">KC-135</SelectItem>
                      <SelectItem value="KC-46" className="text-white hover:bg-slate-700">KC-46</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="aviation-text-muted hover:aviation-text"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="aviation-blue aviation-blue-hover"
              >
                Create Mission
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
