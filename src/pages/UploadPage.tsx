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
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Ensure sonner toast is imported
import { useAuth } from '@/context/AuthContext';

const UploadPage = () => {
  const { role } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;

    if (!file) {
      toast.error("Please select a file to upload.");
      setIsSubmitting(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1]; // Remove data prefix
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        const fileType = file.name.split('.').pop();

        const payload = {
          file_content: base64String,
          file_name: fileNameWithoutExt,
          file_type: fileType,
          title: title,
          description: description,
          user_name: userName,
          user_email: userEmail,
          user_role: role || 'unknown',
        };

        const response = await fetch('https://your-api-id.execute-api.region.amazonaws.com/dev/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed.');
        }

        toast.success('Your knowledge is uploaded successfully!');
        event.currentTarget.reset();
        setFileName(null);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "An error occurred during upload.");
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Knowledge</CardTitle>
          <CardDescription>
            Add a new file or document to the chatbot's database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label className="font-semibold">File Source</Label>
              <Label
                htmlFor="file"
                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
              >
                {fileName ? (
                  <div className="text-center p-4">
                    <p className="font-semibold text-primary break-all">{fileName}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported: .txt, .md, .doc, .docx, .xls, .xlsx
                    </p>
                  </div>
                )}
                <Input
                  id="file"
                  name="file"
                  type="file"
                  required
                  accept=".txt,.md,.doc,.docx,.xls,.xlsx"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Details</h3>
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
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Submitted By</h3>
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
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Knowledge"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;