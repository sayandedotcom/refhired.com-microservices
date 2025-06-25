"use client";

import Navbar from "@/components/navbar";

export default function PortalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="scroll-smooth">
        <Navbar />
        {children}
      </section>
    </>
  );
}
