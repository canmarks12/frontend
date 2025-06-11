'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableListProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  searchPlaceholder?: string;
  searchKey?: string;
}

export function TableList({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Search...',
  searchKey = 'name',
}: TableListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}