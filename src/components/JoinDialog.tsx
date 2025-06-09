import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface JoinDialogProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  joinHandler: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  groupName: string;
  isJoining: boolean;
  groupSecret: string;
}

function JoinDialog({inputValue, setInputValue, joinHandler, open, setOpen, groupName, isJoining, groupSecret}: JoinDialogProps) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-4 w-[80vw] md:w-auto">
          Join Group
        </Button>
      </DialogTrigger>
      {!localStorage.getItem('uuid') && (
      <DialogContent className="bg-card">
      <DialogHeader>
        <DialogTitle className="text-center">You&#39;ve Been Invited</DialogTitle>
        <DialogDescription className="text-center">
          Sign up to create, control and keep track of your groups!
        </DialogDescription>
      </DialogHeader>
      <DialogDescription className="text-center mb-4">
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
            if (groupSecret) {
              navigator.clipboard.writeText(groupSecret);
              toast.success("Copied to clipboard!");
            }
          }}
        >
        {groupSecret ? ` ${groupSecret} ` : ""}
        </span>to your Summary section<br />
        3) Enter your LeetCode ID below<br />
        4) Click the button link your account
      </DialogDescription>
        <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4 text-center">
                <Link href="/sign-up">
                  <Button 
                    className="w-full"
                    variant="secondary"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="leetercoder"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isJoining}
                    required
                  />
                </div>
                <Button 
                  variant="default" 
                  className="w-full"
                  disabled={isJoining}
                  onClick={(e) => {
                    e.preventDefault();
                    joinHandler();
                  }}
                >
                  {isJoining ? "Joining..." : "Join '" + groupName + "'"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
      </DialogContent>
      )}
      {localStorage.getItem('uuid') && (
        <DialogContent className="bg-card">
          <DialogHeader>
        <DialogTitle className="text-center">You&#39;ve Been Invited</DialogTitle>
          <DialogDescription className="text-center">
            You are already have a leeterboard account. Click the button below to join the group.
          </DialogDescription>
        </DialogHeader>
          <Button 
          variant="default" 
          className="w-full"
          disabled={isJoining}
          onClick={(e) => {
            e.preventDefault();
            joinHandler();
          }}
        >
          {isJoining ? "Joining..." : "Join '" + groupName + "'"}
        </Button>
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
      )}
    </Dialog>
  );
};

export default JoinDialog;