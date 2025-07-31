import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react'; // Import useRef
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const UploadPage = () => {
  const { role } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form

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

    if (!file) {
      toast.error('Please select a file to upload.');
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
          user_role: role || 'unknown', // Include user role
        };

        const response = await fetch(
          'https://lsryw4rfx7.execute-api.ap-south-1.amazonaws.com/bot-api-gateway-stage/upload',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed.');
        }

        toast.success('Your knowledge is uploaded successfully!');
        if (formRef.current) {
          // Safely check if the ref exists before resetting
          formRef.current.reset(); // Use the ref to reset the form
        }
        setFileName(null); // Clear the displayed file name
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.message || 'An error occurred during upload.');
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
          <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
            {' '}
            {/* Attach the ref to the form */}
            <div className="space-y-2">
              <Label className="font-semibold">File Source</Label>
              <Label
                htmlFor="file"
                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
              >
                {fileName ? (
                  <div className="text-center p-4">
                    <p className="font-semibold text-primary break-all">
                      {fileName}
                    </p>
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
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Knowledge'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
