"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { PrizeCardFormData } from "@/schema/contestSchema";

interface PrizeCardManagerProps {
  prizeCards: PrizeCardFormData[];
  onChange: (prizeCards: PrizeCardFormData[]) => void;
}

const cardTypeOptions = [
  { value: "grand", label: "🏆 Grand Prize", color: "yellow" },
  { value: "second", label: "🥈 Second Place", color: "gray" },
  { value: "third", label: "🥉 Third Place", color: "orange" },
  { value: "demo", label: "🏢 Demo Center", color: "blue" },
  { value: "special", label: "🌟 Special Prize", color: "purple" },
  { value: "participation", label: "🎁 Participation", color: "green" },
];

export default function PrizeCardManager({ prizeCards, onChange }: PrizeCardManagerProps) {
  const addPrizeCard = () => {
    const newCard: PrizeCardFormData = {
      title: "",
      description: "",
      order: prizeCards.length + 1,
      cardType: "grand",
    };
    console.log("Adding new prize card:", newCard);
    console.log("Current prize cards:", prizeCards);
    const updatedCards = [...prizeCards, newCard];
    console.log("Updated prize cards:", updatedCards);
    onChange(updatedCards);
  };

  const updatePrizeCard = (index: number, field: keyof PrizeCardFormData, value: string | number) => {
    const updatedCards = [...prizeCards];
    // Ensure order is always a number
    if (field === 'order') {
      updatedCards[index] = { ...updatedCards[index], [field]: Number(value) };
    } else {
      updatedCards[index] = { ...updatedCards[index], [field]: value };
    }
    onChange(updatedCards);
  };

  const removePrizeCard = (index: number) => {
    const updatedCards = prizeCards.filter((_, i) => i !== index);
    // Reorder the remaining cards
    const reorderedCards = updatedCards.map((card, i) => ({ ...card, order: i + 1 }));
    onChange(reorderedCards);
  };

  const moveCard = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === prizeCards.length - 1)) {
      return;
    }

    const updatedCards = [...prizeCards];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap the cards
    [updatedCards[index], updatedCards[targetIndex]] = [updatedCards[targetIndex], updatedCards[index]];
    
    // Update order numbers
    updatedCards[index].order = index + 1;
    updatedCards[targetIndex].order = targetIndex + 1;
    
    onChange(updatedCards);
  };

  const getCardTypeColor = (cardType: string) => {
    const option = cardTypeOptions.find(opt => opt.value === cardType);
    return option?.color || "gray";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Prize Cards</h3>
        <Button onClick={addPrizeCard} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Prize Card
        </Button>
      </div>

      {prizeCards.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No prize cards yet. Click "Add Prize Card" to get started.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {prizeCards.map((card, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Prize Card #{index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        onClick={() => moveCard(index, "up")}
                        disabled={index === 0}
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        onClick={() => moveCard(index, "down")}
                        disabled={index === prizeCards.length - 1}
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                    <Button
                      onClick={() => removePrizeCard(index)}
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`card-type-${index}`}>Card Type</Label>
                    <Select
                      value={card.cardType}
                      onValueChange={(value) => updatePrizeCard(index, "cardType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cardTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`card-title-${index}`}>Title</Label>
                    <Input
                      id={`card-title-${index}`}
                      value={card.title}
                      onChange={(e) => updatePrizeCard(index, "title", e.target.value)}
                      placeholder="e.g., 🏆 GRAND PRIZE"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`card-description-${index}`}>Description</Label>
                  <RichTextEditor
                    content={card.description}
                    onChange={(value) => updatePrizeCard(index, "description", value)}
                    placeholder="Enter the prize description..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use the toolbar above to format your text with bold, italic, lists, etc.
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
