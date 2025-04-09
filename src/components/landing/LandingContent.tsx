
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingContent = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="md:flex md:items-center md:gap-12">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Preserve Your Family History
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Create, visualize, and share your family tree with Garbh, the most intuitive family tree builder.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg"
              alt="Family Tree Visualization"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContent;
