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

interface Student {
  id: number;
  name: string;
  regNo: string;
  class: string;
  email: string;
}

export default function StudentOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Fetch all students to check for duplicates
      const students = await get<Student[]>("/students");

      // Check if student with same regNo already exists
      const existingByRegNo = students.some(
        (s) => s.regNo === values.name_3511791745
      );
      if (existingByRegNo) {
        toast.error("Student with this registration number already exists", {
          description: `Registration number ${values.name_3511791745} is already in the system.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Check if student with same name and class exists
      const existingByNameAndClass = students.some(
        (s) =>
          s.name.toLowerCase() === values.name_4649100899.toLowerCase() &&
          s.class === values.name_8628958331
      );
      if (existingByNameAndClass) {
        toast.error("Student already exists in this class", {
          description: `${values.name_4649100899} is already registered in ${values.name_8628958331}.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Create new student
      const newStudent = {
        name: values.name_4649100899,
        regNo: values.name_3511791745,
        class: values.name_8628958331,
        email: `${values.name_4649100899
          .toLowerCase()
          .replace(/\s+/g, ".")}@school.edu`,
      };

      const created = await post<Student>("/students", newStudent);

      toast.success("Student created successfully!", {
        description: (
          <div className="mt-2 text-xs space-y-1">
            <p>
              <strong>Name:</strong> {created.name}
            </p>
            <p>
              <strong>Reg No:</strong> {created.regNo}
            </p>
            <p>
              <strong>Class:</strong> {created.class}
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
      toast.error("Failed to create student", {
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
            <FieldLabel htmlFor="name_3511791745">Reg No</FieldLabel>
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
            {isSubmitting ? "Creating..." : "Create Student"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
