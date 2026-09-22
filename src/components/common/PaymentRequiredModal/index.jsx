import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink } from 'lucide-react';

const PaymentRequiredModal = ({ 
  isOpen, 
  onClose, 
  resyUrl 
}) => {
  const handleContinueOnResy = () => {
    if (resyUrl) {
      window.open(resyUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <CreditCard className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-shipGrey font-agrandir text-center">
            Payment Required
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Payment is needed to be done. We request you to continue booking on Resy where your card is connected.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              To complete your reservation, please continue on Resy where your payment method is already set up.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueOnResy}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Continue on Resy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRequiredModal;

