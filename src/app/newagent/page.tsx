"use client";

import React from 'react';
import { AgentShowcase } from '@/components/AgentShowcase';

export default function NewAgentPage() {
  return (
    <main className="w-full h-screen bg-[#070708] overflow-hidden">
      <AgentShowcase isVisible={true} />
    </main>
  );
}
