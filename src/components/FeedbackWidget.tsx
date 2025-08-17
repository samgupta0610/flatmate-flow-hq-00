import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Star, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFeedback, type FeedbackType } from "@/hooks/useFeedback";

const feedbackSchema = z.object({
  feedback_type: z.enum(['feature_request', 'bug_report', 'general', 'improvement']),
  rating: z.number().min(1).max(5).optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const feedbackTypeLabels: Record<FeedbackType, string> = {
  feature_request: "Feature Request",
  bug_report: "Bug Report",
  general: "General Feedback",
  improvement: "Improvement Suggestion",
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const { submitFeedback, isSubmitting } = useFeedback();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback_type: 'general',
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    const success = await submitFeedback({
      feedback_type: data.feedback_type,
      title: data.title,
      description: data.description,
      rating: rating > 0 ? rating : undefined,
    });

    if (success) {
      form.reset();
      setRating(0);
      setIsOpen(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1 rounded-sm hover:bg-background/50 transition-colors"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} star{rating !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-blue-200/50 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-blue-100/30 transition-all duration-300 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-blue-800">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-full hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-semibold">MVP Feedback</span>
                  <p className="text-sm font-normal text-blue-700 mt-1 leading-relaxed">
                    Help us improve MaidEasy with your thoughts!
                  </p>
                </div>
              </div>
              <div className="transition-transform duration-300 hover:scale-110">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="feedback_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Type of Feedback</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select feedback type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(feedbackTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-800">
                    Overall Rating (Optional)
                  </label>
                  {renderStars()}
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief summary of your feedback" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your thoughts, suggestions, or issues..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FeedbackWidget;