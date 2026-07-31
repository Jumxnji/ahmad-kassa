"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { submitQuestion } from "@/actions/public/ask";
import { askFormSchema, type AskFormValues } from "@/validators/public/ask-form.validator";

const TOPICS: { value: AskFormValues["topic"]; label: string }[] = [
  { value: "marriage", label: "Marriage" },
  { value: "family", label: "Family" },
  { value: "aqeedah", label: "Aqeedah" },
  { value: "fiqh", label: "Fiqh" },
  { value: "ruqyah", label: "Ruqyah" },
  { value: "mental-health", label: "Mental Health" },
  { value: "other", label: "Other" },
];

export function AskAhmadForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AskFormValues>({
    resolver: zodResolver(askFormSchema),
    defaultValues: { name: "", email: "", question: "" },
  });

  function onSubmit(values: AskFormValues) {
    startTransition(async () => {
      const result = await submitQuestion(values);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ask anything about marriage, family, aqeedah, fiqh, ruqyah, or mental health…"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Submitting a question does not guarantee an immediate response.
          Some questions may be answered privately, while others may be
          published anonymously for the benefit of the wider community.
        </p>
        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Ask a Question"}
        </Button>
      </form>
    </Form>
  );
}
