import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { KeyRound, Loader2 } from "lucide-react"

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

const schema = yup.object({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  recoveryCode: yup.string().required("Recovery code is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[a-z]/, "Include a lowercase letter")
    .matches(/[0-9]/, "Include a number")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
})

type Values = yup.InferType<typeof schema>

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [formError, setFormError] = useState("")
  const [newCode, setNewCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<Values>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", recoveryCode: "", password: "", confirmPassword: "" },
  })

  const onSubmit = async (values: Values) => {
    setFormError("")
    try {
      const code = await resetPassword(values.email, values.recoveryCode, values.password)
      setNewCode(code)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.startsWith("LOCKED:")) {
        setFormError(`Too many attempts. Try again in ${msg.split(":")[1]} seconds.`)
      } else if (msg === "INVALID_RECOVERY") {
        setFormError("Email or recovery code is incorrect.")
      } else {
        setFormError("Something went wrong. Please try again.")
      }
    }
  }

  const copyCode = async () => {
    if (!newCode) return
    try {
      await navigator.clipboard.writeText(newCode)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {newCode ? "Password updated" : "Reset your password"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {newCode
                ? "Save your new recovery code"
                : "Enter your email and the recovery code from signup"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {newCode ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Your old recovery code no longer works. Store this new one somewhere safe. It is
                shown only once.
              </p>
              <div className="rounded-lg border border-border bg-muted px-3 py-3 text-center font-mono text-lg tracking-wider text-foreground">
                {newCode}
              </div>
              <Button type="button" variant="outline" onClick={copyCode}>
                {copied ? "Copied" : "Copy code"}
              </Button>
              <Button asChild>
                <Link to="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                  name="recoveryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recovery code</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" {...field} />
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
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                      </FormControl>
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
                      <Loader2 className="size-4 animate-spin" /> Resetting...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>

        {!newCode && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}