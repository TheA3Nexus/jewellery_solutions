import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  Gift, 
  Calendar, 
  FileText, 
  Coins, 
  Smartphone,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const WhatsAppAutomations = () => {
  const { tenant } = useTenant();

  // Active Triggers Config
  const [triggers, setTriggers] = useState({
    invoicePdf: true,
    schemeEmi: true,
    girviInterest: true,
    anniversaryWishes: true,
    festivalBroadcasts: false
  });

  const [selectedTemplate, setSelectedTemplate] = useState('INVOICE'); // 'INVOICE', 'SCHEME', 'BIRTHDAY'
  const [testMobile, setTestMobile] = useState('+91 98200 12345');
  const [testSentNotice, setTestSentNotice] = useState(false);

  // Outbound Message Dispatch Log
  const [messageLogs, setMessageLogs] = useState([
    {
      id: 'MSG-9041',
      recipient: 'Mrs. Ananya Verma (+91 98201 12345)',
      type: 'INVOICE_PDF',
      snippet: 'Dear Ananya ji, thank you for purchasing from A3 Jewellery. Your GST Tax Invoice INV-2026-0891 is attached.',
      status: 'READ',
      time: '11:32 AM Today'
    },
    {
      id: 'MSG-9040',
      recipient: 'Rohan Mehta (+91 98991 44556)',
      type: 'INVOICE_PDF',
      snippet: 'Dear Rohan ji, thank you for purchasing from A3 Jewellery. Your GST Tax Invoice INV-2026-0892 is attached.',
      status: 'DELIVERED',
      time: '06:16 PM Today'
    },
    {
      id: 'MSG-9038',
      recipient: 'Kavita Joshi (+91 98110 99887)',
      type: 'SCHEME_EMI',
      snippet: 'Dear Kavita ji, your Dhan-Varsha Kitty installment of Rs 5,000 is due on 25th Oct. Click to pay via UPI.',
      status: 'READ',
      time: '10:00 AM Yesterday'
    },
    {
      id: 'MSG-9035',
      recipient: 'Suresh Kumar (+91 94140 22334)',
      type: 'GIRVI_NOTICE',
      snippet: 'Urgent notice regarding Pawn Loan GL-2026-4091. 11-month statutory deadline approaching on 30th Nov.',
      status: 'DELIVERED',
      time: '04:15 PM 20-Oct'
    }
  ]);

  const toggleTrigger = (key) => {
    setTriggers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendTest = (e) => {
    e.preventDefault();
    if (!testMobile) return;
    setTestSentNotice(true);
    const newLog = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      recipient: `Test Recipient (${testMobile})`,
      type: selectedTemplate === 'INVOICE' ? 'INVOICE_PDF' : selectedTemplate === 'SCHEME' ? 'SCHEME_EMI' : 'GREETING',
      snippet: `[LIVE WABA DISPATCH] Automated ${selectedTemplate} template delivered to ${testMobile}.`,
      status: 'READ',
      time: 'Just now'
    };
    setMessageLogs([newLog, ...messageLogs]);
    setTimeout(() => setTestSentNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              WhatsApp Business Cloud API Automation
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Meta Cloud Verified
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Enterprise event-driven WhatsApp delivery for GST tax invoices, monthly savings scheme EMI reminders, and auction radar notices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-950 border border-surface-800 text-surface-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>WABA Status: <b className="text-emerald-400">Active (200 TPS)</b></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Automation Triggers & Rules */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-2xl p-5 space-y-4 shadow-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Automated Event Dispatch Triggers
          </h3>

          <div className="space-y-3 text-xs">
            {/* Invoice PDF Trigger */}
            <div className="flex items-center justify-between p-3.5 bg-surface-950 rounded-xl border border-surface-800">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Instant GST Tax Invoice Dispatch
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Sends customer clean PDF invoice + warranty card immediately on POS settlement.
                  </span>
                </div>
              </div>
              <button 
                id="btn-toggle-invoice-pdf"
                onClick={() => toggleTrigger('invoicePdf')}
                className="focus:outline-none"
              >
                {triggers.invoicePdf ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-surface-600" />
                )}
              </button>
            </div>

            {/* Scheme EMI Reminder Trigger */}
            <div className="flex items-center justify-between p-3.5 bg-surface-950 rounded-xl border border-surface-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Swarna Nidhi Scheme EMI Reminders
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Auto-sends reminder 3 days prior to monthly installment due date with 1-click UPI pay link.
                  </span>
                </div>
              </div>
              <button 
                id="btn-toggle-scheme-emi"
                onClick={() => toggleTrigger('schemeEmi')}
                className="focus:outline-none"
              >
                {triggers.schemeEmi ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-surface-600" />
                )}
              </button>
            </div>

            {/* Girvi Overdue Notice Trigger */}
            <div className="flex items-center justify-between p-3.5 bg-surface-950 rounded-xl border border-surface-800">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Girvi Gold Loan Interest &amp; Auction Radar
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Dispatches statutory 11-month legal auction warning notices with postal dispatch log.
                  </span>
                </div>
              </div>
              <button 
                id="btn-toggle-girvi-interest"
                onClick={() => toggleTrigger('girviInterest')}
                className="focus:outline-none"
              >
                {triggers.girviInterest ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-surface-600" />
                )}
              </button>
            </div>

            {/* Birthday & Anniversary Greeting */}
            <div className="flex items-center justify-between p-3.5 bg-surface-950 rounded-xl border border-surface-800">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Birthday &amp; Wedding Anniversary Wishes
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Sends warm greetings at 9:00 AM with exclusive 15% making charge discount coupon.
                  </span>
                </div>
              </div>
              <button 
                id="btn-toggle-anniversary"
                onClick={() => toggleTrigger('anniversaryWishes')}
                className="focus:outline-none"
              >
                {triggers.anniversaryWishes ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-surface-600" />
                )}
              </button>
            </div>
          </div>

          {/* Test Dispatch Form */}
          <form onSubmit={handleSendTest} className="pt-3 border-t border-surface-800 space-y-2 text-xs">
            <span className="font-semibold text-surface-300 block">Interactive Live WABA Dispatch Simulator</span>
            <div className="flex gap-2">
              <input
                id="input-test-mobile"
                type="text"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                placeholder="+91 Mobile number..."
                className="flex-1 bg-surface-950 border border-surface-700 rounded-lg px-3 py-1.5 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
              />
              <button
                id="btn-send-test-whatsapp"
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Test
              </button>
            </div>
            {testSentNotice && (
              <span id="notice-test-sent" className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3 h-3" /> Test message delivered via Meta WhatsApp API to {testMobile}
              </span>
            )}
          </form>
        </div>

        {/* Right: Interactive Smartphone Preview */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-2xl p-5 flex flex-col justify-between items-center shadow-md">
          <div className="w-full flex justify-between items-center border-b border-surface-800 pb-2 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              Live WhatsApp Customer Screen Preview
            </h3>
            <div className="flex gap-1 text-[11px] font-semibold bg-surface-950 p-1 rounded-lg border border-surface-800">
              <button
                id="btn-preview-tpl-invoice"
                onClick={() => setSelectedTemplate('INVOICE')}
                className={`px-2.5 py-0.5 rounded transition-colors ${selectedTemplate === 'INVOICE' ? 'bg-surface-800 text-brand-400 font-bold border border-surface-700' : 'text-surface-400 hover:text-surface-200'}`}
              >
                Tax Invoice
              </button>
              <button
                id="btn-preview-tpl-scheme"
                onClick={() => setSelectedTemplate('SCHEME')}
                className={`px-2.5 py-0.5 rounded transition-colors ${selectedTemplate === 'SCHEME' ? 'bg-surface-800 text-brand-400 font-bold border border-surface-700' : 'text-surface-400 hover:text-surface-200'}`}
              >
                Kitty EMI
              </button>
              <button
                id="btn-preview-tpl-birthday"
                onClick={() => setSelectedTemplate('BIRTHDAY')}
                className={`px-2.5 py-0.5 rounded transition-colors ${selectedTemplate === 'BIRTHDAY' ? 'bg-surface-800 text-brand-400 font-bold border border-surface-700' : 'text-surface-400 hover:text-surface-200'}`}
              >
                Greeting
              </button>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="w-72 bg-emerald-50/60 border-2 border-surface-700 rounded-3xl p-3 shadow-xl relative my-2">
            {/* Top Speaker Pill */}
            <div className="w-20 h-3 bg-surface-800 rounded-full mx-auto mb-2" />

            {/* WhatsApp Chat Bubble */}
            <div id="preview-whatsapp-bubble" className="bg-[#E7FFDB] border border-emerald-300 rounded-2xl p-3 text-xs text-slate-950 space-y-2 shadow-sm font-sans">
              <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-500/20">
                <div className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                  A3
                </div>
                <span className="font-bold text-[11px] text-slate-950">{tenant?.name || 'A3 JEWELLERY & SONS'}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-700 ml-auto" />
              </div>

              {selectedTemplate === 'INVOICE' && (
                <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-900">
                  <p>Namaste <strong>Mrs. Ananya Verma</strong> ji,</p>
                  <p>Thank you for shopping at <strong>{tenant?.name || 'A3 JEWELLERY'}</strong>! 💍</p>
                  <div className="bg-white/85 p-2 rounded-lg border border-emerald-300 font-mono text-[10px] space-y-0.5">
                    <div>Invoice: <strong className="text-slate-950">INV-2026-0891</strong></div>
                    <div>Item: 22K Peacock Choker (31.85g)</div>
                    <div>Total Paid: <strong className="text-slate-950">₹2,59,044</strong></div>
                    <div>HUID: <strong className="text-amber-800">HD99281</strong></div>
                  </div>
                  <p className="text-slate-700 text-[10px]">Your digital GST tax invoice &amp; BIS hallmark certificate is attached below.</p>
                  <div className="pt-1">
                    <button className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm">
                      <FileText className="w-3 h-3" /> Download Tax Invoice PDF
                    </button>
                  </div>
                </div>
              )}

              {selectedTemplate === 'SCHEME' && (
                <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-900">
                  <p>Namaste <strong>Kavita</strong> ji,</p>
                  <p>Gentle reminder: Your monthly installment for <strong>Swarna Nidhi 11+1 Scheme</strong> is due on <strong>25th Oct</strong>.</p>
                  <div className="bg-white/85 p-2 rounded-lg border border-emerald-300 font-mono text-[10px] space-y-0.5">
                    <div>Passbook: <strong className="text-slate-950">SCH-2026-8820</strong></div>
                    <div>Installment: Month 6 of 11</div>
                    <div>Amount: <strong className="text-slate-950">₹5,000</strong></div>
                  </div>
                  <div className="pt-1">
                    <button className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm">
                      <Send className="w-3 h-3" /> Pay ₹5,000 via UPI Link
                    </button>
                  </div>
                </div>
              )}

              {selectedTemplate === 'BIRTHDAY' && (
                <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-900">
                  <p>Warmest Greetings from <strong>{tenant?.name || 'A3 JEWELLERY'}</strong>!</p>
                  <p>Wishing you a very Happy Wedding Anniversary! May your bond sparkle brighter than gold forever.</p>
                  <div className="bg-white/85 p-2 rounded-lg border border-emerald-300 text-[10px] space-y-0.5">
                    <div>Exclusive Gift Voucher Code:</div>
                    <div className="text-amber-800 font-mono font-bold text-xs">ANNIV-GOLD-15</div>
                    <div className="text-slate-700">Enjoy <strong>15% OFF on Making Charges</strong> valid for 15 days.</div>
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center gap-1 text-[9px] text-slate-600 pt-1">
                <span>11:32 AM</span>
                <CheckCheck className="w-3 h-3 text-sky-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outbound Dispatch Activity Log */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Recent Automated Outbound WhatsApp Transmissions
          </h3>
          <span id="stat-log-count" className="text-xs text-surface-400 font-mono">
            {messageLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table id="table-whatsapp-logs" className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Recipient Customer</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Message Content Snippet</th>
                <th className="px-4 py-3 text-center">Delivery Status</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {messageLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-800/40">
                  <td className="px-4 py-3 font-sans font-medium text-surface-100">
                    {log.recipient}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-surface-800 text-surface-300 border border-surface-700">
                      {log.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-surface-300 max-w-md truncate">
                    {log.snippet}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                      <CheckCheck className="w-3 h-3 text-sky-400" /> {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-surface-400 font-sans text-[11px]">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
