'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { TableList } from '@/components/shared/TableList';
import { ModalForm } from '@/components/shared/ModalForm';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface OperasionalExpense {
  id: number;
  keterangan: string;
  jumlah: number;
  tanggal: string;
  kategori: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FormData {
  keterangan: string;
  jumlah: string;
  tanggal: string;
  kategori: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function OperasionalPage() {
  const [expenses, setExpenses] = useState<OperasionalExpense[]>([
    {
      id: 1,
      keterangan: 'Pembelian ATK Kantor',
      jumlah: 2500000,
      tanggal: '2024-01-15',
      kategori: 'office',
      status: 'approved',
    },
    {
      id: 2,
      keterangan: 'Biaya Listrik Bulan Januari',
      jumlah: 3200000,
      tanggal: '2024-01-10',
      kategori: 'utilities',
      status: 'pending',
    },
    {
      id: 3,
      keterangan: 'Maintenance Komputer',
      jumlah: 1800000,
      tanggal: '2024-01-08',
      kategori: 'maintenance',
      status: 'approved',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<OperasionalExpense | null>(null);
  const [formData, setFormData] = useState<FormData>({
    keterangan: '',
    jumlah: '',
    tanggal: '',
    kategori: '',
    status: 'pending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = [
    { value: 'office', label: 'Office Supplies' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'transport', label: 'Transportation' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const columns = [
    {
      key: 'keterangan',
      label: 'Keterangan',
    },
    {
      key: 'jumlah',
      label: 'Jumlah',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (value: string) => {
        const category = categories.find(cat => cat.value === value);
        return category ? category.label : value;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge className={statusColors[value as keyof typeof statusColors]}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setCurrentExpense(null);
    setFormData({
      keterangan: '',
      jumlah: '',
      tanggal: '',
      kategori: '',
      status: 'pending',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (expense: OperasionalExpense) => {
    setCurrentExpense(expense);
    setFormData({
      keterangan: expense.keterangan,
      jumlah: expense.jumlah.toString(),
      tanggal: expense.tanggal,
      kategori: expense.kategori,
      status: expense.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (expense: OperasionalExpense) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== expense.id));
    }
  };

  const handleSave = () => {
    if (!formData.keterangan || !formData.jumlah || !formData.tanggal) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      jumlah: parseInt(formData.jumlah),
    };

    if (currentExpense) {
      setExpenses(expenses.map(e => 
        e.id === currentExpense.id 
          ? { ...e, ...expenseData }
          : e
      ));
    } else {
      const newExpense: OperasionalExpense = {
        id: Math.max(...expenses.map(e => e.id)) + 1,
        ...expenseData,
      };
      setExpenses([...expenses, newExpense]);
    }

    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar title="Operasional Expenses" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Manage Expenses</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage operational expenses
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <TableList
          data={paginatedExpenses}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search expenses..."
          searchKey="keterangan"
        />

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentExpense ? 'Edit Expense' : 'Add New Expense'}
          onSave={handleSave}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan *</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Enter expense description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jumlah">Jumlah *</Label>
                <Input
                  id="jumlah"
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tanggal">Tanggal *</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'pending' | 'approved' | 'rejected') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ModalForm>
      </div>
    </>
  );
}