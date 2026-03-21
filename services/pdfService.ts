import { jsPDF } from 'jspdf';
import { Fabric, Style, Design, Measurements, AITailorFeedback, Gender, SleeveLength } from '../types';

/**
 * Generates a professional tailoring specification PDF.
 */
export const generateTailorSpecification = async (
    originalImage: string,
    generatedImage: string,
    measurements: Measurements,
    style: Style,
    fabric: Fabric,
    design: Design,
    sleeveLength: SleeveLength,
    gender: Gender,
    feedback: AITailorFeedback
): Promise<void> => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // ----- Styling & Branding -----
    const primaryColor = '#171717'; // Deep charcoal
    const accentColor = '#c59a7c'; // Sandstone
    const textColor = '#404040';
    const lightGray = '#f5f5f5';

    // Set Font
    doc.setFont('helvetica');

    // Title & Header
    doc.setFillColor(lightGray);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(primaryColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PATTERN FIT AI', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(accentColor);
    doc.text('PROFESSIONAL TAILORING SPECIFICATION', 105, 28, { align: 'center' });

    // Date
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 200, 35, { align: 'right' });

    // ----- Section: Virtual Preview -----
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('Visual Preview (AI Simulation)', 15, 55);
    
    // Add images (Assume data URIs)
    try {
        // Original Photo (Thumbnail)
        doc.addImage(originalImage, 'JPEG', 15, 60, 50, 65);
        doc.setFontSize(8);
        doc.text('Reference Pose', 15, 128);

        // Virtual Fitting (Main Preview)
        doc.addImage(generatedImage, 'PNG', 75, 60, 120, 150); // Larger focal image
        doc.setFontSize(10);
        doc.text('Virtual Fitting Simulation', 135, 215, { align: 'center' });
    } catch (e) {
        console.error("Failed to add images to PDF:", e);
    }

    // ----- Section: Style & Fabric Details -----
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Design Details', 15, 150);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Style:', 15, 160);
    doc.setFont('helvetica', 'normal');
    doc.text(`${style.name} (${gender})`, 50, 160);

    doc.setFont('helvetica', 'bold');
    doc.text('Fabric:', 15, 168);
    doc.setFont('helvetica', 'normal');
    doc.text(fabric.name, 50, 168);

    doc.setFont('helvetica', 'bold');
    doc.text('Design/Embroidery:', 15, 176);
    doc.setFont('helvetica', 'normal');
    doc.text(design.name, 50, 176);

    doc.setFont('helvetica', 'bold');
    doc.text('Sleeve Length:', 15, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(sleeveLength, 50, 184);

    // ----- NEW PAGE for Measurements & Assessment -----
    doc.addPage();

    // Section Header
    doc.setFillColor(lightGray);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Measurement Specifications', 105, 13, { align: 'center' });

    // Measurements Table
    const measurementKeys = Object.entries(measurements)
        .filter(([, val]) => val !== undefined);
    
    let yPos = 40;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Measurement Point', 20, 35);
    doc.text('Estimated Value (Inches)', 150, 35, { align: 'right' });
    doc.line(15, 37, 195, 37); // Header Line

    measurementKeys.forEach(([key, value]) => {
        doc.setFont('helvetica', 'normal');
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        doc.text(label, 20, yPos);
        doc.text(`${value}"`, 150, yPos, { align: 'right' });
        doc.setDrawColor(240, 240, 240);
        doc.line(15, yPos + 2, 195, yPos + 2);
        yPos += 8;
    });

    // ----- Section: AI Tailor Insights -----
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('AI Tailor\'s Assessment', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    
    const splitImpression = doc.splitTextToSize(`Impression: ${feedback.overallImpression}`, 170);
    doc.text(splitImpression, 20, yPos);
    yPos += (splitImpression.length * 5) + 2;

    const splitFit = doc.splitTextToSize(`Fit Analysis: ${feedback.fitAnalysis}`, 170);
    doc.text(splitFit, 20, yPos);
    yPos += (splitFit.length * 5) + 2;

    const splitTips = doc.splitTextToSize(`Styling Tip: ${feedback.styleTip}`, 170);
    doc.text(splitTips, 20, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(accentColor);
    doc.text('This specification was generated by PatternFit AI and is intended as a guide. Please confirm all physical measurements before production.', 105, 285, { align: 'center' });

    // Save
    doc.save(`PatternFit_Specification_${style.name.replace(/\s+/g, '_')}.pdf`);
};
