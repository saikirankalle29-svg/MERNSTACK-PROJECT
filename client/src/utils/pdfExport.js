import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportComplaintPDF = (complaint) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(30, 41, 59); // Dark blue header
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CivicRoute Official Incident Report', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Civic Routing & Resolution Certificate', 14, 26);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, 130, 26);

  // Complaint Metadata Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Complaint Details', 14, 45);

  const complaintDetails = [
    ['Complaint ID', complaint._id || 'N/A'],
    ['Title', complaint.title || 'N/A'],
    ['Category', complaint.category || 'N/A'],
    ['Department', complaint.departmentName || 'General Civics'],
    ['Priority Level', complaint.priority || 'Medium'],
    ['Current Status', complaint.status || 'Submitted'],
    ['Incident Location', complaint.location || 'N/A'],
    ['Date Reported', new Date(complaint.createdAt).toLocaleString()]
  ];

  doc.autoTable({
    startY: 50,
    head: [['Attribute', 'Details']],
    body: complaintDetails,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });

  let currentY = doc.lastAutoTable.finalY + 10;

  // Descriptions & AI Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Original Citizen Description:', 14, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(complaint.description || 'No description provided.', 180);
  doc.text(descLines, 14, currentY + 6);

  currentY += 10 + descLines.length * 5;

  if (complaint.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Groq AI Summary & Polished Analysis:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(complaint.improvedComplaint || complaint.summary, 180);
    doc.text(summaryLines, 14, currentY + 6);
    currentY += 10 + summaryLines.length * 5;
  }

  // Resolution Timeline
  if (complaint.timeline && complaint.timeline.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit & Resolution Timeline', 14, currentY);

    const timelineData = complaint.timeline.map((item) => [
      item.status,
      item.updatedBy,
      item.note || '-',
      new Date(item.timestamp).toLocaleString()
    ]);

    doc.autoTable({
      startY: currentY + 4,
      head: [['Status', 'Updated By', 'Remarks', 'Timestamp']],
      body: timelineData,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
  }

  // Save PDF
  doc.save(`CivicRoute-Report-${complaint._id ? complaint._id.slice(-6) : 'INC'}.pdf`);
};
