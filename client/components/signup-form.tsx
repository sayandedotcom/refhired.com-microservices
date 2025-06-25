import { cn } from "@/lib/utils";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address !" })
    .nonempty("Required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return axios.post("/api/users/signup", {
        email: email,
        password: password,
      });
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      router.push("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      console.log("Form submitted with values:", values);
      mutate({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome !</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {form.formState?.errors?.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    required
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {form.formState?.errors?.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
