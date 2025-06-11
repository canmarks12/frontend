'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false,
}: ModalFormProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onSave && (
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : saveLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}