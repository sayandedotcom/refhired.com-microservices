"use client";

import { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { portalsList } from "@/config/portals-list";
import { useWindowSize } from "@/hooks";
import clsx from "clsx";
import { ArrowUpRight, ChevronsUpDown, Info, PartyPopper, PenTool, Send, Star } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Separator } from "@referrer/ui";

import { LeftBarMobile, RightBarMobile } from "@/components/custom-components";
import { Icons } from "@/components/icons/icons";
import { Badge, PostTypeDialog, TooltipDemo, sonerToast } from "@/components/ui";
import { PlaceholdersAndVanishInput } from "@/components/ui";

import { shrinkSidebarRoutes, withoutRightBarPages } from "@/config";

import { useStore } from "@/store/store";

import Filters from "./filters";

export function LeftSection() {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const path = "/" + pathName.split("/")[1];
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const setDisplayRequest = useStore((state) => state.setDisplayRequest);

  return (
    <>
      {shrinkSidebarRoutes.some((route) => pathName.startsWith(route)) ? (
        <section className="bg-muted/40 sticky left-0 top-0 z-50 hidden h-screen w-[15%] md:hidden lg:block lg:w-[4%]">
          <div className="flex h-full w-full flex-col items-start justify-start">
            <Link
              href="/home"
              className="mx-auto mt-2 flex cursor-pointer items-center justify-center gap-4 p-2">
              <Icons.logo className="h-8" />
            </Link>
            <div className="font-heading w-full tracking-wider lg:flex lg:flex-col lg:justify-start">
              <div className="cursor-pointer px-2 py-4 text-base">
                {portalsList.map(({ name, link, icon }) => (
                  <TooltipDemo key={name} side="right" text={name}>
                    <Link
                      onClick={() => {
                        setDisplayRequest(null);
                        // router.push(link ?? `/${session?.user.userName}` ?? "/profile");
                      }}
                      id={name.toLocaleLowerCase()}
                      href={link ?? `/${session?.user.userName}` ?? "/profile"}
                      className={clsx(
                        "hover:bg-muted flex items-center justify-center gap-4 rounded-md px-2 py-3 transition active:scale-95",
                        path === "/" + link?.split("/")[1] && "bg-muted hover:bg-muted/100"
                      )}>
                      <span>{icon}</span>
                    </Link>
                  </TooltipDemo>
                ))}
              </div>
            </div>
            <PostTypeDialog>
              <Button
                size="lg"
                className="font-heading mx-auto rounded-full border-black px-3 py-6 text-base font-semibold transition active:scale-95">
                <Send />
              </Button>
            </PostTypeDialog>
            <div className="bg-muted mx-auto mb-3 mt-auto flex w-full flex-col items-center justify-center gap-3 rounded-lg border p-2 px-3 lg:w-[95%]">
              <Image
                src={session?.user.image ?? "/images/avatar/avatar.png"}
                height={60}
                width={60}
                className="rounded-md"
                alt="img"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-muted/40 sticky left-0 top-0 hidden h-screen w-[15%] md:hidden lg:block lg:w-[20%]">
          <div className="flex h-full w-full flex-col items-start justify-start">
            <Link
              href="/home"
              className="mx-auto ml-7 mt-2 flex cursor-pointer items-center justify-center gap-4 p-2">
              <Icons.logo className="h-8" />
              <h5 className="font-heading mt-1">Refhired.com</h5>
            </Link>
            <div className="font-heading w-full tracking-wider lg:flex lg:flex-col lg:justify-start">
              <div className="cursor-pointer px-2 py-4 text-base">
                {portalsList.map(({ name, link, icon }) => (
                  <Link
                    key={name}
                    id={name.toLocaleLowerCase()}
                    href={link ?? `/${session?.user.userName}` ?? "/profile"}
                    className={clsx(
                      "hover:bg-muted flex items-center gap-4 rounded-md px-2 py-2",
                      path === "/" + link?.split("/")[1] &&
                        "bg-muted hover:bg-muted/100 transition active:scale-95"
                    )}>
                    <span className="ml-5">{icon}</span>
                    <p className="mt-1 hidden lg:block">{name}</p>
                  </Link>
                ))}
              </div>
            </div>
            <PostTypeDialog>
              <Button
                size="lg"
                className="font-heading mx-auto rounded-full border-2 border-black px-3 py-3 text-2xl font-semibold transition active:scale-95 lg:w-11/12 lg:py-7">
                {width < 1000 ? <PenTool /> : "Post"}
              </Button>
            </PostTypeDialog>
            <div className="bg-muted mx-auto mb-3 mt-auto flex w-full flex-col items-center justify-center gap-3 rounded-lg border p-2 px-3 lg:w-[95%]">
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <div className="flex w-full items-center justify-between gap-3 py-2">
                  <Image
                    src={session?.user.image ?? "/images/avatar/avatar.png"}
                    height={60}
                    width={60}
                    className="rounded-md"
                    alt="img"
                  />
                  <div className=" mr-auto">
                    <p className="hidden text-lg font-semibold lg:block">{session?.user?.name ?? "Name"}</p>
                    <span className="hidden text-sm lg:block">@{session?.user?.userName ?? "username"}</span>
                  </div>
                  {!session?.user && (
                    <Button
                      className="font-heading rounded-lg px-5 text-sm transition active:scale-95"
                      onClick={() =>
                        router.push("/auth/login" + "?" + createQueryString("callbackUrl", pathName))
                      }>
                      Join now !
                    </Button>
                  )}
                  {session?.user && (
                    <CollapsibleTrigger asChild>
                      <Button size="sm" className="bg-background hover:bg-background w-9 p-0">
                        <ChevronsUpDown className="h-5 w-5 font-semibold text-white" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                {/* <div className="rounded-md border px-4 py-3 text-sm">2</div> */}
                <CollapsibleContent className="space-y-2">
                  <Button className="font-heading w-full px-6 text-start text-base transition active:scale-95">
                    Manage Account
                  </Button>
                  <Button
                    className="text-foreground font-heading w-full bg-red-600 px-6 text-start text-base transition hover:bg-red-600/90 active:scale-95"
                    onClick={() => signOut()}>
                    Log out @{session?.user.userName}
                  </Button>
                </CollapsibleContent>
                <div className="flex w-full items-center gap-3 py-2">
                  <Badge className="bg-background text-foreground border-foreground hover:bg-background mx-0 flex h-full items-center justify-center gap-3 rounded-sm">
                    <Star className="h-5" />
                    <span className="font-heading mt-1 text-base font-bold">{session?.user.stars}</span>
                  </Badge>
                  <Button
                    onClick={() => router.push("/purchase")}
                    className="font-heading h-9 text-start transition active:scale-95">
                    {/* <Coins className="mb-1 mr-2 h-5 w-5" />  */}
                    Buy Stars
                  </Button>
                  {/* <Button
                    onClick={() => router.push("/purchase")}
                    className="font-heading h-9 text-start transition active:scale-95">
                    Withdraw
                  </Button> */}
                  {session?.user?.paidForDashboard && (
                    <Button className="font-heading w-full px-6 text-start transition active:scale-95">
                      Go to Dashboard <ArrowUpRight className="mb-1 mr-4 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </Collapsible>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function CenterSection({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const largeLayout = withoutRightBarPages.includes(pathName);

  return (
    <>
      <section
        className={clsx(
          "flex w-full flex-col",
          largeLayout ? "lg:w-[80%]" : "lg:w-[60%]",
          shrinkSidebarRoutes.some((route) => pathName.startsWith(route)) && "lg:w-[96%]"
        )}>
        <div className="flex flex-row justify-between px-4">
          <LeftBarMobile />
          {largeLayout ? (
            <></>
          ) : (
            <h5 className="font-heading py-4 capitalize md:mx-auto">{pathName.split("/")[1]}</h5>
          )}
          <RightBarMobile />
        </div>
        <Separator className="dark:bg-[#2d3134]" />
        {children}
      </section>
    </>
  );
}

export function RightSection() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const showExtraSection = withoutRightBarPages.includes(pathName);

  const setJoyRide = useStore((state) => state.setJoyRide);

  const placeholders = [
    "Remote Front-End Developer jobs",
    "Full Stack jobs in San Francisco",
    "Javascript jobs",
    "Referrals in Google",
  ];

  return (
    <section
      className={clsx(
        showExtraSection && "md:hidden lg:hidden",
        "bg-muted/40 font-heading sticky right-0 top-0 hidden h-screen w-80 font-medium lg:flex lg:flex-col lg:gap-3 lg:p-2",
        pathName === "/search" ? "lg:w-[25%] " : "lg:w-[20%] "
      )}>
      {pathName === "/search" ? (
        <>
          <Filters />
        </>
      ) : (
        <>
          <PlaceholdersAndVanishInput
            showSugession={false}
            searchIconWidth={"w-[15%]"}
            className={"flex items-center text-xs"}
            placeholders={placeholders}
          />
          <div className="border-border w-full rounded-3xl border bg-gradient-to-br from-amber-600 via-stone-900 via-60% to-sky-900 p-4 backdrop-blur-sm">
            <div className="mb-2">
              <div className="flex gap-2">
                <h5>Custom Pricing !</h5>
                <PartyPopper />
              </div>
              <p className="text-sm">Buy stars as you need</p>
            </div>
            <div>
              <Button
                onClick={() => router.push("/purchase")}
                className="rounded-3xl transition active:scale-95">
                Learn more !
              </Button>
            </div>
          </div>
          {session?.user?.paidForDashboard ? (
            <></>
          ) : (
            <div className="border-border group relative flex w-full flex-col gap-2 overflow-hidden rounded-2xl border bg-neutral-900 p-4 text-gray-50 group-hover:duration-500">
              <div className="z-10 flex flex-col duration-500 before:absolute before:right-16 before:top-20 before:-z-10 before:h-12 before:h-20 before:w-12 before:w-20 before:rounded-full before:bg-sky-400 before:blur-xl before:duration-500 after:absolute after:bottom-32 after:right-16 after:-z-10 after:h-12 after:h-12 after:w-12 after:w-12 after:rounded-full after:bg-orange-400 after:blur-xl after:duration-500 group-hover:before:-translate-y-11 group-hover:before:translate-x-11 group-hover:after:translate-x-11 group-hover:after:translate-y-16">
                <h5>Get Dashboard</h5>
                <p className="text-sm">Get an advanced AI-powered dashboard for just $49 per year!</p>
              </div>
              <div className="flex gap-2">
                <Button className="rounded-full transition active:scale-95">Get it now</Button>
                <Button className="z-20 rounded-full transition active:scale-95">Learn more !</Button>
              </div>
            </div>
          )}
          <button
            onClick={() => setJoyRide("post-ride")}
            id="start-tour"
            className="bg-muted flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-lg">
            <Info className="mb-1 h-5" /> <p>Info</p>
          </button>
          <div className="bg-muted rounded-sm px-4 py-2">
            <h6>Changelog</h6>
          </div>
          <Button
            onClick={() =>
              sonerToast({
                title: "Hi this is the first Toasts",
                message: "Lorem sum dolor sit amet consectetur adipisicing elit. Adipisci modi, ",
                severity: "warning",
              })
            }>
            Soner
          </Button>
        </>
      )}
    </section>
  );
}
