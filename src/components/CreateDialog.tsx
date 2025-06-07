import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface CreateDialogProps {
  groupName: string;
  setGroupName: (value: string) => void;
  groupSecret: string;
  setGroupSecret: (value: string) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  isLoading: boolean;
  createHandler: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateDialog: React.FC<CreateDialogProps> = (props) => {

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer">+ Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={props.groupName}
              onChange={(e) => props.setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-secret">Group Secret (For users without leeterboard account)</Label>
            <Input
              id="group-secret"
              value={props.groupSecret}
              onChange={(e) => props.setGroupSecret(e.target.value)}
              placeholder="Enter group secret"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="privacy-switch"
              checked={props.isPrivate}
              onCheckedChange={props.setIsPrivate}
            />
            <Label htmlFor="privacy-switch">
              {props.isPrivate ? "Private Group" : "Public Group"}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={props.createHandler} disabled={props.isLoading}>
            {props.isLoading ? "Creating..." : "Create"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;