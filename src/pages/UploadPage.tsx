import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const UploadPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    // TODO: Integrate POST /api/upload here
    try {
      // Example API call:
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // if (response.ok) {
      //   toast.success("File uploaded successfully!");
      //   event.currentTarget.reset();
      // } else {
      //   toast.error("Upload failed. Please try again.");
      // }

      // Simulating API call for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form data submitted:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      toast.success("Knowledge source submitted for processing!");
      event.currentTarget.reset();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-0 md:p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Knowledge</CardTitle>
          <CardDescription>
            Add a new knowledge source to the chatbot's database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                required
                accept=".txt,.md,.doc,.docx,.xls,.xlsx"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: .txt, .md, .doc, .docx, .xls, .xlsx
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Q3 Financial Report"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief summary of the document's content."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">User Email</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;