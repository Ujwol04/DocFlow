import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FileText, Loader2 } from "lucide-react"

import { Button } from "@Components/ui/Button"
import { Input } from "@Components/ui/Input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Components/ui/Form"
import { useAuth } from "@Hooks/useAuth"

const signupSchema = yup.object({
  name: yup.string().min(2, "Enter your full name").required("Name is required"),
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[a-z]/, "Include a lowercase letter")
    .matches(/[0-9]/, "Include a number")
    .required("Password is required"),
})

type SignupValues = yup.InferType<typeof signupSchema>

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState("")
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<SignupValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: SignupValues) => {
    setFormError("")
    try {
      const code = await register(values.name, values.email, values.password)
      setRecoveryCode(code)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      setFormError(
        msg === "EMAIL_EXISTS"
          ? "An account with this email already exists."
          : "Something went wrong. Please try again."
      )
    }
  }

  const copyCode = async () => {
    if (!recoveryCode) return
    try {
      await navigator.clipboard.writeText(recoveryCode)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (recoveryCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
              <FileText className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Save your recovery code</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                You will need it if you forget your password
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              This code is shown only once and cannot be recovered later. Store it somewhere safe.
            </p>
            <div className="rounded-lg border border-border bg-muted px-3 py-3 text-center font-mono text-lg tracking-wider text-foreground">
              {recoveryCode}
            </div>
            <Button type="button" variant="outline" onClick={copyCode}>
              {copied ? "Copied" : "Copy code"}
            </Button>
            <Button type="button" onClick={() => navigate("/dashboard", { replace: true })}>
              I've saved it, continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign up to get started</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" autoComplete="name" {...field} />
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
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && (
                <p className="text-sm font-medium text-destructive">{formError}</p>
              )}

              <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2 w-full">
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}