"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import UserAPI from "@/api/user"
import { useRouter } from "next/navigation"
import { DialogTitle } from "@radix-ui/react-dialog"

type Group = string

export function GroupSelector() {
  const [open, setOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [ownedGroups, setOwnedGroups] = useState<Group[]>([])
  const [otherGroups, setOtherGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    setLoading(true)
    const fetchUserProfile = async () => {
      if (localStorage.getItem('uuid')) {
        try {
          const response = await UserAPI.getUserProfile(localStorage.getItem('uuid') || "");
          console.log("group selector")
          if (!response.success) {
            toast.error(response.message || "Failed to fetch user profile.");
            return;
          }
          const owned = response.owned.map((item: [string, string[]]) => item[0])
          const groups = response.groups.filter((g: string[]) => !owned.includes(g))
          setOwnedGroups(owned)
          setOtherGroups(groups)
          setLoading(false)
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("An error occurred while fetching your profile.");
        }
      }
    };
    fetchUserProfile();
  }, [])

    const triggerLabel = isDesktop
      ? selectedGroup || "+ Select group"
      : "+"


  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            {triggerLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <GroupList
            loading={loading}
            ownedGroups={ownedGroups}
            otherGroups={otherGroups}
            setOpen={setOpen}
            setSelectedGroup={setSelectedGroup}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[45px] justify-start">
          {triggerLabel}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[40vh]">
        <DialogTitle className="mt-4 mx-auto text-lg font-semibold">
          Select Group
        </DialogTitle>
        <div className="mt-4 border-t">
          <GroupList
            loading={loading}
            ownedGroups={ownedGroups}
            otherGroups={otherGroups}
            setOpen={setOpen}
            setSelectedGroup={setSelectedGroup}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function GroupList({
  loading,
  ownedGroups,
  otherGroups,
  setOpen,
  setSelectedGroup,
}: {
  loading: boolean
  ownedGroups: Group[]
  otherGroups: Group[]
  setOpen: (open: boolean) => void
  setSelectedGroup: (group: Group | null) => void
}) {
  const router = useRouter()
  console.log("Rendering GroupList", { loading, ownedGroups, otherGroups })
  return (
    <Command>
      <CommandInput placeholder="Filter groups..." />
      <CommandList>
        {loading ? (
          <CommandEmpty>Loading...</CommandEmpty>
        ) : (
          <>
              {ownedGroups.length === 0 ? (
                <CommandEmpty>No owned groups.</CommandEmpty>
              ) : (
                <CommandGroup heading="Your Groups">
                  {ownedGroups.map((group) => (
                    <CommandItem
                      key={group}
                      value={group}
                      onSelect={() => {
                        setSelectedGroup(group)
                        setOpen(false)
                        router.push(`/${group}`)
                      }}
                    >
                      {group}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            <div className="my-2 h-px w-full bg-muted" />
            <CommandGroup>
              {otherGroups.length === 0 ? (
                <CommandEmpty>No other groups.</CommandEmpty>
              ) : (
                otherGroups.map((group) => (
                  <CommandItem
                    key={group}
                    value={group}
                    onSelect={() => {
                      setSelectedGroup(group)
                      setOpen(false)
                      router.push(`/${group}`)
                    }}
                  >
                    {group}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mediaQueryList = window.matchMedia(query)
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)

    mediaQueryList.addEventListener("change", listener)
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
