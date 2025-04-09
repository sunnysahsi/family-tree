
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FamilyTree } from "@/types/FamilyTree";
import { useToast } from "@/hooks/use-toast";

const treeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tree name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  memoryNotes: z.string().optional(),
});

type TreeFormValues = z.infer<typeof treeFormSchema>;

interface EditTreeFormProps {
  tree?: FamilyTree;
  onSubmit: (values: TreeFormValues) => Promise<void>;
  isLoading?: boolean;
}

const EditTreeForm = ({ tree, onSubmit, isLoading = false }: EditTreeFormProps) => {
  const { toast } = useToast();

  const form = useForm<TreeFormValues>({
    resolver: zodResolver(treeFormSchema),
    defaultValues: {
      name: tree?.name || "",
      description: tree?.description || "",
      isPublic: tree?.isPublic || false,
      memoryNotes: tree?.memoryNotes || "",
    },
  });

  const handleSubmit = async (values: TreeFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: "Tree updated",
        description: "Your family tree has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update family tree. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Name</FormLabel>
              <FormControl>
                <Input placeholder="Family tree name" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this family tree"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about this family tree and who is included.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Tree</FormLabel>
                <FormDescription>
                  Make this tree visible to anyone with the link
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memoryNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Reminder Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add personal memory notes about this family tree"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These personal notes can help you remember details about this family tree. Only visible to you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Tree"}
        </Button>
      </form>
    </Form>
  );
};

export default EditTreeForm;
