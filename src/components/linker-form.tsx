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
import { useAuth } from "@/components/AuthContext";
import { Loader } from "@/components/Loader";
import UserAPI from "@/api/user";

export function LinkerForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loaderState, setLoaderState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    
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
          router.push("/dashboard");
        } else {
          toast("You are already signed up, please link your account");
          router.push("/link");
        }
      }
    };

    checkUserStatus();
  }, [userLoggedIn, user, router]);

  const handleSubmit = async (username: string) => {
    setIsLoading(true);
    if (!user?.emailVerified) {
      toast.error("Please verify your email before linking your account.");
      setIsLoading(false);
      return;
    }
    try {
      if (!username) {
        toast.error("Please enter your LeetCode ID");
        return;
      }
      const response = await UserAPI.registerUser(user.uid, username);
      if (!response.success) {
        toast.error(response.message || "Failed to link account.");
        return;
      }
      toast.success("Account linked successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          toast.error("Please set your LeetCode status to the code above.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (loaderState) {
    return <Loader />
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register your LeetCode account!</CardTitle>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"></div>
          <CardDescription>
            1) Go to your{" "}
            <a
              href="https://leetcode.com/profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              LeetCode Profile
            </a>{" "}
            page<br />
            2) Copy paste this code 
            <span
              className="cursor-pointer text-[#ffa41d] hover:underline"
              title="Click to copy"
              onClick={() => {
                if (user?.uid) {
                  navigator.clipboard.writeText(user.uid);
                  toast.success("Copied to clipboard!");
                }
              }}
            >
              {user?.uid ? ` ${user.uid} ` : ""}
            </span><br/>to your Summary section<br />
            3) Enter your LeetCode ID below
            4) Click the button link your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(username);
          }}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"></div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">LeetCode ID</Label>
                  <Input
                    id="username"
                    placeholder="leetercoder"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Linking..." : "Link Account"}
                </Button>
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
