import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "../../components/inputs/SimpleInput"; // Adjust path as needed
import { AtSign, Lock, User } from "lucide-react"; // Assuming these icons are used
import { toast } from "sonner";
import { pb } from "@/api/apiClient";
import { extract_message } from "@/helpers/api";

interface SignupFormInputs {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm<SignupFormInputs>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setError,
  } = methods;

  const password = watch("password");

  const onSubmit = (data: SignupFormInputs) => {
    // Manual validation for password match
    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log(data);
    toast.promise(pb.collection("users").create(data), {
      loading: "Creating account...",
      success: "Account created successfully!",
      error: extract_message,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 space-y-6 ring fade">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-sm text-gray-500">
            Welcome! Please enter your details.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SimpleInput
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User size={16} />}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
            <SimpleInput
              label="Email"
              type="email"
              placeholder="Enter your email address"
              icon={<AtSign size={16} />}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "A minimum of 8 characters",
                  },
                })}
              />
              <SimpleInput
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                {...register("passwordConfirm", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>

            {/*<div className="space-y-1 text-sm">
              <p className="font-semibold">Your password must contain:</p>
              <ul className="grid grid-cols-2 gap-1">
                <li
                  className={`flex items-center gap-2 ${
                    password && password.length >= 8
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {password && password.length >= 8 ? "✓" : "✗"} A minimum of 8
                  characters.
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    password && /[0-9]/.test(password)
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {password && /[0-9]/.test(password) ? "✓" : "✗"} At least one
                  number
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    password && /[a-z]/.test(password)
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {password && /[a-z]/.test(password) ? "✓" : "✗"} At least one
                  lowercase letter
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    password && /[A-Z]/.test(password)
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {password && /[A-Z]/.test(password) ? "✓" : "✗"} At least one
                  uppercase letter
                </li>
              </ul>
            </div>*/}

            <button type="submit" className="btn btn-primary w-full">
              Signup
            </button>
          </form>
        </FormProvider>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="link link-hover text-primary">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
