"use client";

import { useState, useMemo } from "react";
import { DeleteWrestlerDialog } from "@/components/admin/DeleteWrestlerDialog";
import { WrestlerWithPromotion } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import Link from "next/link";

interface WrestlersTableProps {
  wrestlers: WrestlerWithPromotion[];
}

export function WrestlersTable({ wrestlers }: WrestlersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [promotionFilter, setPromotionFilter] = useState<string>("all");

  // Get unique promotions for filter
  const promotions = useMemo(() => {
    const unique = new Set(
      wrestlers.map((w) => w.promotion?.name).filter(Boolean)
    );
    return Array.from(unique);
  }, [wrestlers]);

  // Filter wrestlers
  const filteredWrestlers = useMemo(() => {
    return wrestlers.filter((wrestler) => {
      const matchesSearch =
        wrestler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wrestler.ring_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || wrestler.status === statusFilter;
      const matchesPromotion =
        promotionFilter === "all" ||
        wrestler.promotion?.name === promotionFilter;

      return matchesSearch && matchesStatus && matchesPromotion;
    });
  }, [wrestlers, searchQuery, statusFilter, promotionFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "retired":
        return "bg-gray-600";
      case "injured":
        return "bg-yellow-600";
      case "released":
        return "bg-red-600";
      default:
        return "bg-dark-600";
    }
  };

  return (
    <Card className="bg-dark-900 border-dark-800">
      <CardHeader>
        <CardTitle>All Wrestlers</CardTitle>
        <CardDescription>
          {filteredWrestlers.length} wrestler
          {filteredWrestlers.length !== 1 ? "s" : ""} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
            <Input
              placeholder="Search wrestlers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-800 border-dark-700"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-dark-800 border-dark-700 cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="all"
              >
                All Status
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="active"
              >
                Active
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="retired"
              >
                Retired
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="injured"
              >
                Injured
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="released"
              >
                Released
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Promotion Filter */}
          <Select value={promotionFilter} onValueChange={setPromotionFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-dark-800 border-dark-700 cursor-pointer">
              <SelectValue placeholder="Promotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                className="cursor-pointer hover:bg-red-400"
                value="all"
              >
                All Promotions
              </SelectItem>
              {promotions.map((promotion) => (
                <SelectItem
                  className="cursor-pointer hover:bg-red-400"
                  key={promotion}
                  value={promotion}
                >
                  {promotion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredWrestlers.length > 0 ? (
          <div className="rounded-md border border-dark-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-dark-800 border-dark-800">
                  <TableHead>Name</TableHead>
                  <TableHead>Ring Name</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWrestlers.map((wrestler) => (
                  <TableRow
                    key={wrestler.id}
                    className="hover:bg-dark-800 border-dark-800"
                  >
                    <TableCell className="font-medium">
                      {wrestler.name}
                    </TableCell>
                    <TableCell>{wrestler.ring_name || "-"}</TableCell>
                    <TableCell>
                      {wrestler.promotion ? (
                        <Badge
                          variant="outline"
                          className="text-secondary-500 border-secondary-500"
                        >
                          {wrestler.promotion.abbreviation ||
                            wrestler.promotion.name}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{wrestler.brand || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(wrestler.status)}>
                        {wrestler.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/wrestlers/${wrestler.id}`}>
                          <Button
                            className="cursor-pointer hover:text-red-400"
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/wrestlers/${wrestler.id}/edit`}>
                          <Button
                            className="cursor-pointer hover:text-red-400"
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteWrestlerDialog
                          wrestler={wrestler}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-500">No wrestlers found</p>
            <Link href="/admin/wrestlers/new">
              <Button className="mt-4 bg-primary-600 hover:bg-primary-700 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add First Wrestler
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
