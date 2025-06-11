import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { CircleX, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserAPI from "@/api/user";
import GroupAPI from "@/api/group";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

interface SettingsDrawerProps {
  groupName: string;
  groupMembers: string[];
  groupSecret: string;
}

export function SettingsDrawer({ groupName, groupMembers, groupSecret }: SettingsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [allowChange, setAllowChange] = useState(false);
  const [secretInput, setSecretInput] = useState(groupSecret);
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState(groupSecret);
  const [members, setMembers] = useState<string[]>(groupMembers);

  const deleteHandler = async (username: string) => {
    try {
      const response = await UserAPI.removeUserFromGroup(groupName, username);
      if (response.success) {
        toast.success(`${username} has been removed from the group.`);
        const newMembers = members.filter(member => member !== username);
        setMembers(newMembers);
        return;
      }
      toast.error(response.message || `Failed to remove ${username} from the group.`);
    } catch (error) {
      console.error("Error removing user from group:", error);
      toast.error(`Failed to remove ${username} from the group.`);
    }
  }

  const changeHandler = async () => {
    setIsLoading(true);
    if (!secretInput) {
      toast.error("Secret cannot be empty.");
      return;
    } try {
      const trimmedGroupSecret = secretInput.trim();
      if (/[^a-zA-Z0-9_-]/.test(trimmedGroupSecret)) {
        toast.error("Group secret can only contain letters, numbers, underscores, and hyphens.");
        setIsLoading(false);
        return;
      }
      const response = await GroupAPI.changeGroupSecret(groupName, trimmedGroupSecret);
      if (response.success) {
        toast.success("Group secret changed successfully.");
        setSecretInput(trimmedGroupSecret);
        setSecret(trimmedGroupSecret);
      }
      else {
        toast.error(response.message || "Failed to change group secret.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred while changing the group secret.");
      }
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className={`transition-transform duration-200 ${open ? "scale-125 rotate-90 bg-accent" : ""} hover:scale-125 hover:rotate-90`}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh] md:h-[40vh]">
        <div className="flex flex-col md:flex-row h-full p-6 pb-30 md:pb-6 md:px-24 gap-6 md:gap-24">
          <div className="flex-1 flex flex-col">
            <DrawerTitle className="text-2xl font-bold text-center mb-6">
              {groupName}
            </DrawerTitle>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
          {members.map((member) => (
            <div
              key={member}
              className="flex items-center justify-between bg-muted rounded px-3 py-2"
            >
              <span className="truncate">{member}</span>
                <Dialog>
                <DialogTrigger asChild>
                  <Button
                  className="text-destructive hover:bg-destructive/10 rounded"
                  aria-label={`Remove ${member}`}
                  variant={'destructive'}
                  >
                  <CircleX className="h-4 w-4 text-white" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Remove Member</DialogTitle>
                  <p>Are you sure you want to remove {member} from the group?</p>
                  <div className="flex justify-end gap-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                  variant="destructive"
                  onClick={() => deleteHandler(member)}
                  >
                  Remove
                  </Button>
                  </div>
                </DialogContent>
                </Dialog>
            </div>
          ))}
              </div>
            </div>
            <div className="block md:hidden mt-auto pt-6">
              <label className="block text-sm font-medium mb-1" htmlFor="group-secret-mobile">
                Group Secret
              </label>
              <input
                id="group-secret-mobile"
                type="text"
                value={allowChange ? secretInput : secret}
                readOnly={!allowChange}
                onChange={allowChange ? (e) => setSecretInput(e.target.value) : undefined}
                className="w-full rounded border px-3 py-2 bg-muted"
              />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAllowChange(!allowChange)}
                >
                  {allowChange ? "Lock Secret" : "Change Secret"}
                </Button>
                {allowChange && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                    changeHandler();
                    setAllowChange(false);
                    }}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col min-w-[30vw] max-w-xs md:pt-8">
            <label className="block text-sm font-medium mb-1" htmlFor="group-secret-desktop">
              Group Secret
            </label>
            <input
              id="group-secret-desktop"
              type="text"
              value={allowChange ? secretInput : secret}
              readOnly={!allowChange}
              onChange={allowChange ? (e) => setSecretInput(e.target.value) : undefined}
              className="w-full rounded border px-3 py-2 bg-muted"
            />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAllowChange(!allowChange)}
                  disabled={isLoading}
                >
                  {allowChange ? "Lock Secret" : "Change Secret"}
                </Button>
                {allowChange && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                    changeHandler();
                    setAllowChange(false);
                    }}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                )}
              </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
