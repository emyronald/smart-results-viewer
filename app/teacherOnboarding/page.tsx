"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useState } from "react";
import { post, get } from "@/lib/api";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name_4649100899: z.string().min(1, "Name is required"),
  name_3511791745: z
    .string()
    .length(6, "Must be exactly 6 digits")
    .regex(/^\d+$/, "Must contain only numbers"),
  name_8628958331: z.string().min(1, "Please select a class"),
});

interface Teacher {
  id: number;
  name: string;
  email: string;
  classes: string[];
}

export default function TeacherOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Fetch all teachers to check for duplicates
      const teachers = await get<Teacher[]>("/teachers");

      // Check if teacher with same name already exists
      const existingByName = teachers.some(
        (t) => t.name.toLowerCase() === values.name_4649100899.toLowerCase()
      );
      if (existingByName) {
        toast.error("Teacher with this name already exists", {
          description: `${values.name_4649100899} is already registered in the system.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Check if teacher already assigned to this class
      const existingInClass = teachers.some((t) =>
        t.classes.includes(values.name_8628958331)
      );
      if (existingInClass) {
        toast.error("Class already has a teacher assigned", {
          description: `${values.name_8628958331} already has a teacher assigned. Please select a different class.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Create new teacher
      const newTeacher = {
        name: values.name_4649100899,
        email: `${values.name_4649100899
          .toLowerCase()
          .replace(/\s+/g, ".")}@school.edu`,
        classes: [values.name_8628958331],
      };

      const created = await post<Teacher>("/teachers", newTeacher);

      toast.success("Teacher created successfully!", {
        description: (
          <div className="mt-2 text-xs space-y-1">
            <p>
              <strong>Name:</strong> {created.name}
            </p>
            <p>
              <strong>Email:</strong> {created.email}
            </p>
            <p>
              <strong>Classes:</strong> {created.classes.join(", ")}
            </p>
            <p>
              <strong>ID:</strong> {created.id}
            </p>
          </div>
        ),
      });

      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to create teacher", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[90vh] items-center">
      <Toaster richColors position="top-right" /> {/* 👈 Add Toaster */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <Field>
            <FieldLabel htmlFor="name_4649100899">Name</FieldLabel>
            <Input
              id="name_4649100899"
              placeholder="e.g John Doe"
              {...form.register("name_4649100899")}
              className="input"
            />
            <FieldError>
              {form.formState.errors.name_4649100899?.message}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="name_3511791745">TeacherID</FieldLabel>
            <Input
              id="name_3511791745"
              placeholder="e.g 123456"
              {...form.register("name_3511791745")}
              className="input"
            />
            <FieldError>
              {form.formState.errors.name_3511791745?.message}
            </FieldError>
          </Field>

          <FormField
            control={form.control}
            name="name_8628958331"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="input">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JSS1">JSS1</SelectItem>
                    <SelectItem value="JSS2">JSS2</SelectItem>
                    <SelectItem value="JSS3">JSS3</SelectItem>
                    <SelectItem value="SSS1">SSS1</SelectItem>
                    <SelectItem value="SSS2">SSS2</SelectItem>
                    <SelectItem value="SSS3">SSS3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Teacher"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
