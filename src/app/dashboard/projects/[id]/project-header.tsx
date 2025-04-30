"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/db/schema";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { updateProjectNameAction } from "../actions";

export function ProjectHeader({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const nameChanged = name !== project.name;

  const enterEditMode = () => {
    setEditing(true);
  };

  const exitEditMode = async () => {
    setEditing(false);
    if (nameChanged) {
      await updateProjectNameAction(project.id, name);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl flex items-center gap-2 font-bold">
            <span>{project.emoji}</span>
            {editing ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <h1>{project.name}</h1>
            )}
          </div>
          {editing ? (
            nameChanged ? (
              <Button variant={"ghost"} onClick={exitEditMode}>
                <Check className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant={"ghost"} onClick={exitEditMode}>
                <X className="w-4 h-4" />
              </Button>
            )
          ) : (
            <Button variant={"ghost"} onClick={enterEditMode}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
