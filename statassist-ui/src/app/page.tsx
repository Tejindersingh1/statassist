'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Sigma, FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero section */}
      <div className="bg-blue-50 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Design clinical studies without the hassle</h1>
          <p className="text-lg mb-8">Quickly create, manage, and analyze your research</p>
          <Link href="/studies/new">
            <Button size="lg" className="text-base px-6 py-6">
              New Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/studies/new" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <PlusCircle className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-lg font-medium">New study</span>
              </div>
            </Card>
          </Link>
          <Link href="/resources/power-calculator" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Sigma className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-lg font-medium">Power calc</span>
              </div>
            </Card>
          </Link>
          <Link href="/resources/templates" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-lg font-medium">Templates</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Studies */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Studies</h2>
          <Link href="/studies" className="text-blue-600 hover:underline flex items-center">
            View all <span className="ml-1">›</span>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="divide-y">
            <div className="p-4 md:p-6 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Study Study• Title 1</h3>
                <p className="text-gray-500 mt-1">Observational</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Active</span>
                <span className="text-gray-500 text-sm">2d ago</span>
              </div>
            </div>
            <div className="p-4 md:p-6 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Study Study• Title 2</h3>
                <p className="text-gray-500 mt-1">Clinical Trial</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Active</span>
                <span className="text-gray-500 text-sm">5d ago</span>
              </div>
            </div>
            <div className="p-4 md:p-6 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Recent Study 1</h3>
                <p className="text-gray-500 mt-1">Cross-Sectional</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Draft</span>
                <span className="text-gray-500 text-sm">5d ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
