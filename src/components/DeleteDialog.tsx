import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
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

interface DeleteDialogProps {
  groupName: string;
  deleteHandler: (name: string) => void;
}

function DeleteDialog({groupName, deleteHandler}: DeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="hover:cursor-pointer"><Trash2/></Button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Group</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
        <Label htmlFor="delete-group-name">
          Type <span className="font-bold">{groupName}</span> to confirm deletion
        </Label>
        <Input
          id="delete-group-name"
          placeholder={groupName}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        </div>
      </div>
      <DialogFooter>
        <Button
        variant="destructive"
        onClick={() => deleteHandler(groupName)}
        disabled={inputValue !== groupName}
        >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
        </Button>
        <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;