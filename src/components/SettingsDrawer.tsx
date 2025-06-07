import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SettingsDrawerProps {
  groupName: string;
  members: string[];
  secret: string;
}

export function SettingsDrawer({ groupName, members, secret }: SettingsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [allowChange, setAllowChange] = useState(false);
  const [secretInput, setSecretInput] = useState(secret);

  const deleteHandler = (member: string) => {
    toast('Coming soon: Delete member functionality');
    console.log(`Delete member: ${member}`);
  }

  const changeHandler = (secretInput: string) => {
    toast('Coming soon: Change secret functionality');
    console.log(`Change secret to: ${secretInput}`);
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
          {members.slice(0, 10).map((member) => (
            <div
              key={member}
              className="flex items-center justify-between bg-muted rounded px-3 py-2"
            >
              <span className="truncate">{member}</span>
              <button
                className="ml-2 text-destructive hover:bg-destructive/10 rounded p-1"
                onClick={() => deleteHandler(member)}
                aria-label={`Remove ${member}`}
                type="button"
              >
                <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
                >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
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
                    changeHandler(secretInput);
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
                >
                  {allowChange ? "Lock Secret" : "Change Secret"}
                </Button>
                {allowChange && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                    changeHandler(secretInput);
                    setAllowChange(false);
                    }}
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
