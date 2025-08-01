import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle, doSendEmailVerification } from "@/components/FirebaseAuth"
import { useAuth } from "@/components/AuthContext";
import { Loader } from "@/components/Loader";
import UserAPI from "@/api/user";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderState, setLoaderState] = useState<boolean>(true);
  
  const { user, userLoggedIn } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setLoaderState(false);
    }, 500);

    const checkUserStatus = async () => {
      if (userLoggedIn && user?.uid) {
        const linked = await UserAPI.getUserStatus(user.uid);
        if (linked.found) {
          toast("You are already signed up!");
          console.log('signup')
          router.push("/dashboard");
        } else {
          toast("You are already signed up, please link your account");
          router.push("/link");
        }
      }
    };

    checkUserStatus();
  }, [user, userLoggedIn, router]);

  const handleSignUp = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      await doSendEmailVerification();
      toast.success("Successfully signed up! Please check your email for a verification link.");
      router.push("/link");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
          toast.error("Email already exists. Please try signing in instead.");
          return;
        }
        toast.error(error.message.slice(9));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await doSignInWithGoogle();
      toast.success("Successfully signed up!");
      router.push("/link");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to sign in with Google. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(email, password);
  };

  if (loaderState) {
    return <Loader />
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Hey there</CardTitle>
          <CardDescription>
            Login with Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {isLoading ? "Signing up..." : "Sign up with Google"}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="leeter@code.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>
              </div>
              <div className="text-center text-sm">
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
                {" "}if you already have an account.
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  )
}
