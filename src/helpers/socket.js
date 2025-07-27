/**
 * هذه الوحدة تصدّر دالة واحدة.
 * عند استدعائها في server.js، تستقبل نسخة من خادم Socket.IO (io)
 * وتقوم بإعداد معالجات الأحداث للاتصالات.
 * @param {SocketIO.Server} io - نسخة خادم Socket.IO التي تم تهيئتها في server.js.
 */

const { saveLocationToDB } = require('../controllers/loaction.controller');

module.exports = function(io) {

    io.on('connection', (socket) => {

        const user = socket.request.user;
        if (!user) {
            console.error('Socket connection without authenticated user.');
            return socket.disconnect();
        }
        console.log(`✅ User connected: ${user.email} (Socket ID: ${socket.id})`);

        // الانضمام إلى غرفة خاصة بالطلب
        socket.on('joinOrderRoom', (orderId) => {
            if (!orderId) {
                console.warn(`[Socket WARN] Socket ${socket.id} tried to join a room without an orderId.`);
                return;
            }
            socket.join(orderId);

            // هذا السجل سيؤكد لنا أن المستخدم انضم للغرفة بنجاح
            console.log(`✅ [Room Joined] User ${user.email} (Socket ID: ${socket.id}) successfully joined room: ${orderId}`);
        });

        // استقبال تحديثات موقع المندوب
        socket.on('updateDriverLocation', async (data) => {
            const { orderId, latitude, longitude } = data;
            
            if (!orderId || latitude === undefined || longitude === undefined) {
                console.error('❌ [Socket ERROR] Invalid location update data received:', data);
                return;
            }

            // حفظ الموقع في قاعدة البيانات
            try {
                const locationDataToSave = {
                    driverId: user.id,
                    orderId,
                    latitude,
                    longitude
                };
                await saveLocationToDB(locationDataToSave);
                // console.log(`📍 Location saved for driver ${user.id}`);  

            } catch (error) {
                console.error('❌ [DB ERROR] Failed to save location:', error);
            }
            
            // --- إضافة سجل للتحقق قبل البث ---
            console.log(`📡 [Broadcasting] Sending location update to room: ${orderId}`);
            
            // بث الموقع إلى كل من في الغرفة
            io.to(orderId).emit('driverLocationUpdated', {
                orderId,
                latitude,
                longitude
            });
        });

        // الانفصال عن الخادم
        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${user.email} (Socket ID: ${socket.id})`);
        });
    });
};
