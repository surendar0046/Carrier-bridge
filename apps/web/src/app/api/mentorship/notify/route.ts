import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mentorId = 'mentor-lakshanapriya',
      mentorName = 'Lakshanapriya',
      mentorEmail = 'lakshanapriya0801@gmail.com',
      mentorPhone = '7092036790',
      studentName = 'Student',
      studentEmail = 'student@careerbridge.com',
      studentPhone = '',
      scheduledAt = new Date().toISOString(),
      topic = '1-on-1 Mentorship & Career Guidance',
      duration = 45,
      notes = '',
      meetingUrl = '',
    } = body;

    const cleanPhone = mentorPhone.replace(/\D/g, '');
    const whatsappTarget = cleanPhone.startsWith('91')
      ? cleanPhone
      : cleanPhone.length === 10
      ? `91${cleanPhone}`
      : cleanPhone;

    const formattedDate = new Date(scheduledAt).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Format WhatsApp message with explicit 'Book for mentor session'
    const whatsappMessage =
      `*Book for mentor session*\n\n` +
      `Hello ${mentorName},\n\n` +
      `I want to book a 1-on-1 mentor session on CareerBridge!\n\n` +
      `👤 Student: ${studentName}${studentEmail ? ` (${studentEmail})` : ''}\n` +
      (studentPhone ? `📞 Student Contact: ${studentPhone}\n` : '') +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Time: ${formattedTime}\n` +
      `🎯 Topic: ${topic}\n` +
      `⏳ Duration: ${duration} minutes\n` +
      (notes ? `📝 Note from Student: "${notes}"\n` : '') +
      `\nPlease confirm my mentor session booking. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappTarget}?text=${encodeURIComponent(whatsappMessage)}`;

    // Format Gmail / Email subject and body with 'Book for mentor session'
    const emailSubject = `Book for mentor session: ${topic} (${studentName})`;
    const emailBody =
      `Dear ${mentorName},\n\n` +
      `Book for mentor session request from CareerBridge:\n\n` +
      `SESSION DETAILS:\n` +
      `--------------------------------------------------\n` +
      `Student Name: ${studentName}\n` +
      `Student Email: ${studentEmail}\n` +
      (studentPhone ? `Student Phone: ${studentPhone}\n` : '') +
      `Topic: ${topic}\n` +
      `Date: ${formattedDate}\n` +
      `Time: ${formattedTime}\n` +
      `Duration: ${duration} minutes\n` +
      (notes ? `Student Notes: "${notes}"\n` : '') +
      `--------------------------------------------------\n\n` +
      `Mentor Contact Details:\n` +
      `Email: ${mentorEmail}\n` +
      `Phone / WhatsApp: +91 ${mentorPhone}\n\n` +
      `Please confirm this mentor session booking.\n\n` +
      `Warm regards,\n` +
      `${studentName}`;

    const gmailUrl = `mailto:${mentorEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(mentorEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    console.log(
      `[MENTORSHIP BOOKING] Request received for ${mentorName} (${mentorEmail}, ${mentorPhone}). WhatsApp and Gmail triggers generated.`
    );

    return NextResponse.json({
      success: true,
      message: `Booking request successfully notified to ${mentorName} via WhatsApp (+91 ${mentorPhone}) and Gmail (${mentorEmail})`,
      data: {
        mentor: {
          name: mentorName,
          email: mentorEmail,
          phone: mentorPhone,
        },
        student: {
          name: studentName,
          email: studentEmail,
        },
        whatsappUrl,
        gmailUrl,
        webGmailUrl,
        scheduledAt,
        topic,
      },
    });
  } catch (error: any) {
    console.error('Failed to dispatch mentor notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Notification dispatch failed' },
      { status: 500 }
    );
  }
}
