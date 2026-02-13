"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowAction } from "@/app/Ui/svg";

interface Props {
  eventName: string;
  imageEvent: string;
  location: string;
  eventDate: string;
  clock: string;
  trackingCode: string;
  orderDate: string;
  ticketCount: number;
  totalPrice: number;
  informationTickets: Record<string, Record<string, number[]>>;
}

export default function TicketPDFDownloader({
  eventName,
  imageEvent,
  location,
  eventDate,
  clock,
  trackingCode,
  orderDate,
  ticketCount,
  totalPrice,
  informationTickets,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadImageWithRoundedCorners = (
    url: string,
    cornerRadius: number = 40,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.moveTo(cornerRadius, 0);
          ctx.lineTo(canvas.width - cornerRadius, 0);
          ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
          ctx.lineTo(canvas.width, canvas.height - cornerRadius);
          ctx.quadraticCurveTo(
            canvas.width,
            canvas.height,
            canvas.width - cornerRadius,
            canvas.height,
          );
          ctx.lineTo(cornerRadius, canvas.height);
          ctx.quadraticCurveTo(
            0,
            canvas.height,
            0,
            canvas.height - cornerRadius,
          );
          ctx.lineTo(0, cornerRadius);
          ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = proxyUrl;
    });
  };

  const generatePDF = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;

      const primaryPurple: [number, number, number] = [193, 79, 230];
      const darkBg: [number, number, number] = [15, 15, 15];
      const cardBg: [number, number, number] = [28, 28, 28];

      // ۱. پس‌زمینه و کارت بلیت
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setFillColor(...cardBg);
      doc.roundedRect(margin, 30, contentWidth, pageHeight - 60, 20, 20, "F");

      let currentY = 55;

      // ۲. تصویر با لبه گرد
      if (imageEvent) {
        try {
          const imgData = await loadImageWithRoundedCorners(imageEvent, 50);
          doc.addImage(
            imgData,
            "PNG",
            margin + 30,
            currentY,
            contentWidth - 60,
            210,
          );
        } catch (e) {
          doc.setDrawColor(60, 60, 60);
          doc.roundedRect(
            margin + 30,
            currentY,
            contentWidth - 60,
            210,
            15,
            15,
            "S",
          );
        }
      }
      currentY += 250;

      // ۳. عنوان رویداد
      doc.setTextColor(...primaryPurple);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(eventName.toUpperCase(), pageWidth / 2, currentY, {
        align: "center",
      });

      currentY += 30;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "normal");
      doc.text(location, pageWidth / 2, currentY, { align: "center" });

      currentY += 50;

      // ۴. اطلاعات بلیت
      const drawCol = (label: string, value: string, x: number) => {
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(label, x, currentY);
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(value, x, currentY + 18);
      };

      drawCol("DATE", eventDate, margin + 50);
      drawCol("TIME", clock, margin + 190);
      drawCol("TRACKING", `#${trackingCode}`, margin + 330);

      currentY += 60;

      // ۵. جدول
      const tableData = Object.entries(informationTickets).flatMap(
        ([section, rows]) =>
          Object.entries(rows).map(([row, seats]) => [
            section.toUpperCase(),
            `ROW ${row}`,
            seats.sort((a, b) => a - b).join(", "),
          ]),
      );

      autoTable(doc, {
        startY: currentY,
        head: [["SECTION", "ROW", "SEATS NUMBERS"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [40, 40, 40],
          textColor: primaryPurple,
          fontStyle: "bold",
          cellPadding: 10,
          fontSize: 9,
        },
        bodyStyles: {
          textColor: [230, 230, 230],
          fontSize: 10,
          cellPadding: 10,
          fillColor: [32, 32, 32],
        },
        alternateRowStyles: {
          fillColor: [38, 38, 38],
        },
        margin: { left: margin + 40, right: margin + 40 },
      });

      // ۶. برش بلیت (Ticket Stub)
      const cutY = pageHeight - 190;
      doc.setFillColor(...darkBg);
      doc.circle(margin, cutY, 15, "F");
      doc.circle(pageWidth - margin, cutY, 15, "F");
      doc.setDrawColor(60, 60, 60);
      doc.setLineDashPattern([4, 4], 0);
      doc.line(margin + 15, cutY, pageWidth - margin - 15, cutY);
      doc.setLineDashPattern([], 0);

      const footerY = cutY + 50;

      // ۷. QR Code
      const qrData = `EVENT: ${eventName.toUpperCase()}\nTRACKING: ${trackingCode}\nSEATS:\n${tableData.map((d) => `${d[0]} | ${d[1]} | ${d[2]}`).join("\n")}\nTOTAL: $${totalPrice.toLocaleString()}\nDATE: ${eventDate}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=28-28-28&color=c14fe6`;

      try {
        const qrImg = await loadImageWithRoundedCorners(qrUrl, 10);
        doc.addImage(
          qrImg,
          "PNG",
          pageWidth - margin - 130,
          footerY - 10,
          100,
          100,
        );
      } catch (e) {
        console.error("QR failed");
      }

      // ۸. متون نهایی
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `Total Paid: $${totalPrice.toLocaleString()}`,
        margin + 50,
        footerY + 15,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `${ticketCount} Digital Tickets Reserved`,
        margin + 50,
        footerY + 45,
      );
      doc.text(`Order Date: ${orderDate}`, margin + 50, footerY + 68);

      doc.setFontSize(18);
      doc.setTextColor(...primaryPurple);
      doc.setFont("helvetica", "bold");
      doc.text("EVENJO", margin + 50, footerY + 100);

      doc.save(`Ticket-${trackingCode}.pdf`);
    } catch (err) {
      setErrorMsg("Error generating VIP ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={generatePDF}
        disabled={loading}
        className=" text-main border border-main px-10 py-3.5 rounded-three cursor-pointer font-bold shadow-lg hover:shadow-main/40 transition-all disabled:opacity-50"
      >
        <span className="flex items-center gap-3">
          <ArrowAction /> {loading ? "PROCESSING..." : "DOWNLOAD TICKET"}
        </span>
      </button>
      {errorMsg && (
        <p className="text-red-400 mt-4 text-xs font-bold">{errorMsg}</p>
      )}
    </div>
  );
}
