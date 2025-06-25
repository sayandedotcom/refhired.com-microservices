"use client";
import { client } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";

const accept = [
  {
    id: "shortMessage",
    label: "Short Message",
  },
] as const;

const pdfs = [
  {
    id: "resume",
    label: "Resume",
  },
  {
    id: "coverLetter",
    label: "Cover Letter",
  },
] as const;

const links = [
  {
    id: "linkedin",
    label: "LinkedIn",
  },
  {
    id: "github",
    label: "GitHub",
  },
  {
    id: "portfolio",
    label: "Portfolio",
  },
  {
    id: "medium",
    label: "Medium",
  },
  {
    id: "twitter",
    label: "Twitter",
  },
  {
    id: "dribbble",
    label: "Dribbble",
  },
] as const;

type TPostReferralPost = {
  description: string;
  accept: any;
  expiresAt: any;
  stars: number;
};

const postSchema = z.object({
  description: z.string().min(1, "Description is required"),
  // accept: z.object({
  //   message: z.array(z.string()).optional(),
  //   pdfs: z.array(z.string()).optional(),
  //   links: z.array(z.string()).optional(),
  // }),
  accept: z.object({
    message: z.boolean(),
    pdfs: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
    links: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  }),
  expiresAt: z.date().optional(),
  stars: z.string(),
});

export default function PostPage() {
  const router = useRouter();
  const { data, mutate, isPending } = useMutation({
    mutationKey: ["referral"],
    mutationFn: ({
      description,
      accept,
      expiresAt,
      stars,
    }: TPostReferralPost) => {
      return axios.post("/api/posts", {
        description,
        accept,
        expiresAt,
        stars,
      });
    },
    onSuccess() {
      router.push("/home");
    },
    onError() {
      data?.status === 401 && router.push("/auth/signin");
    },
  });

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      description: "",
      accept: {
        message: true,
        pdfs: ["resume"],
        links: ["linkedin"],
      },
      // expiresAt: new Date(),
      stars: "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    try {
      console.log("Form submitted with values:", values);
      mutate({
        description: values.description,
        accept: values.accept,
        expiresAt: values.expiresAt,
        stars: parseInt(values.stars, 10),
      });
      // mutate({
      //   description: values.description,
      //   accept: {
      //     message: values.accept.message,
      //     pdfs: values.accept.pdfs,
      //     links: values.accept.links,
      //   },
      //   expiresAt: values.expiresAt,
      //   stars: values.stars,
      // });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-60 mb-20 flex flex-col justify-center gap-6"
      >
        <div className="bg-muted sticky top-0 z-50 mx-auto my-5 flex w-[98%] justify-between rounded-md p-5">
          <div>
            <h2 className="mb-3 text-2xl font-bold capitalize tracking-tight">
              Referral Post
            </h2>
            <p className="text-muted-foreground mb-2">
              Post a new referral now and open oppotunies to others !
            </p>
          </div>
          <div className="flex items-start justify-center gap-3">
            <Button
              className="bg-foreground my-2 rounded-full lg:w-40"
              disabled={isPending}
              type="submit"
            >
              Publish
            </Button>
          </div>
        </div>
        <div className="mx-auto flex w-11/12 flex-col justify-center gap-6">
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the description of the referral.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="mb-2">
            <h5 className="font-bold tracking-tight">2. Accept</h5>
            <FormDescription>
              What you want from referral seekers
            </FormDescription>
          </div>
          {/* Accept */}
          <FormField
            control={form.control}
            name="accept.message"
            render={() => (
              <FormItem className="my-2">
                <FormLabel>Accept</FormLabel>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {accept.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="accept.message"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  return checked ? true : false;
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
                <FormDescription>
                  Select the items you want to accept from applicant.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Accept PDFs */}
          <FormField
            control={form.control}
            name="accept.pdfs"
            render={() => (
              <FormItem className="my-2">
                <FormLabel>Accept PDFs</FormLabel>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {pdfs.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="accept.pdfs"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
                <FormDescription>
                  Select the items you want to accept from applicant.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Accept Links */}
          <FormField
            control={form.control}
            name="accept.links"
            render={() => (
              <FormItem className="my-2">
                <FormLabel>Accept Links</FormLabel>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {links.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="accept.links"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
                <FormDescription>
                  Select the items you want to accept from applicant.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="my-2 grid w-full grid-cols-2 items-center gap-4">
            {/* Stars */}
            <FormField
              control={form.control}
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stars</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Stars ⭐"
                      type="number"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of Stars you want to accept.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="mb-2">
            <h5 className="font-bold tracking-tight">5. Deadline</h5>
            <FormDescription>Give a deadline of the post !</FormDescription>
          </div>
          {/* Deadline of Post */}
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value as unknown as Date}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
