"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { client } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

export const applyValidator = z.object({
  message: z.string().nonempty("Message is required"),
  pdfs: z.array(
    z.record(
      z
        .string()
        .nonempty("Required by the Referrers")
        .url({ message: "Please enter a valid URL." })
    )
  ),
  links: z.array(
    z.record(
      z
        .string()
        .min(1, { message: "This field cannot be empty." })
        .nonempty("Required by the Referrers")
        .url({ message: "Please enter a valid URL." })
    )
  ),
});

export function ApplyDialog({
  myObject,
  postId,
  stars,
  userId,
}: {
  myObject?: {
    message?: boolean;
    pdfs: string[];
    links: string[];
  };
  postId?: any;
  stars?: any;
  userId?: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["currentuser"],
    queryFn: () => {
      return client.get("/api/users/currentuser");
    },
  });

  const { data, mutate, isPending } = useMutation({
    mutationKey: ["apply"],
    mutationFn: ({ applyInfo }: { applyInfo: any }) => {
      return client.post(`api/apply/${postId}`, {
        applyInfo,
      });
    },
    onSuccess() {
      setOpen(!open);
    },
    onError() {
      console.error("Error applying for the post");
      data?.status === 400 && router.push("/signup");
    },
  });

  const form = useForm<z.infer<typeof applyValidator>>({
    resolver: zodResolver(applyValidator),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof applyValidator>) {
    console.log("Form submitted with values:", values);

    mutate({ applyInfo: values });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={userId === user?.data?.currentUser?.id || isPending}
          id="post-apply"
          className={cn(
            "h-9 rounded-full text-sm md:w-36",
            userId === user?.data?.currentUser?.id && "hidden"
          )}
        >
          Apply
        </Button>
      </DialogTrigger>
      <DialogContent className="border-foreground w-11/12 md:w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Best of Luck ! 🤞</DialogTitle>
          <DialogDescription className="text-base">
            Provide the necessary information for this referral.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex w-full flex-col space-y-2"
          >
            {/* Message */}
            {myObject?.hasOwnProperty("message") &&
              myObject.message === true && (
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Write a short message to the referrer
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[140px] max-w-full text-base"
                          placeholder="Write a short message to the referrer here. . . . . ."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            {/* PDF */}
            <div className="mt-2">
              {myObject?.hasOwnProperty("pdfs") &&
                myObject.pdfs.map((name, index) => (
                  <FormField
                    control={form.control}
                    key={index}
                    name={`pdfs.${index}.${name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Pdfs
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add pdfs links.
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              {...field}
                              placeholder={
                                name.charAt(0).toUpperCase() + name.slice(1)
                              }
                              type="url"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            <div className="mt-2">
              {myObject?.hasOwnProperty("links") &&
                myObject.links.map((name, index) => (
                  <FormField
                    control={form.control}
                    key={index}
                    name={`links.${index}.${name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Links
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add links to your website, blog, or social media
                          profiles.
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              {...field}
                              placeholder={
                                name.charAt(0).toUpperCase() + name.slice(1)
                              }
                              type="url"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            <Button className="w-5/12 self-center rounded-full" type="submit">
              {stars ? `Apply with ${stars} stars` : "Apply !"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
