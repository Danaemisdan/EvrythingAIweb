"use client";

import React from 'react';
import { NewAgentShowcase } from '@/components/NewAgentShowcase';

export default function NewAgentPage() {
  return (
    <main className="w-full h-screen bg-[#070708] overflow-hidden">
      <NewAgentShowcase isVisible={true} />
    </main>
  );
}
