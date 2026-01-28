import { promisePool } from './db';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const runTest = async () => {
    try {
        console.log('Starting verification test...');

        // 1. Create a Chef
        console.log('Creating test chef...');
        const chefRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Chef',
            email: `testchef_${Date.now()}@example.com`,
            password: 'password123',
            role_id: 1,
            phone: '123456789'
        });
        const chefId = chefRes.data.user.id;
        console.log(`Chef created with ID: ${chefId}`);

        // 2. Create a Chef Profile
        await axios.post(`${BASE_URL}/chefs/profile`, {
            user_id: chefId,
            specialties: 'Italian, French',
            work_zone: 'Madrid',
            has_vehicle: true,
            bio: 'Experienced chef'
        });
        console.log('Chef profile created.');

        // 3. Create a Menu
        console.log('Creating menu...');
        const menuRes = await axios.post(`${BASE_URL}/menus`, {
            chef_id: chefId,
            title: 'Delicious Pasta',
            description: 'Homemade pasta with tomato sauce',
            price: 15.50,
            image_url: 'http://example.com/pasta.jpg'
        });
        const menuId = menuRes.data.id;
        console.log(`Menu created with ID: ${menuId}`);

        // 4. Create a Diner
        console.log('Creating test diner...');
        const dinerRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Diner',
            email: `testdiner_${Date.now()}@example.com`,
            password: 'password123',
            role_id: 2,
            phone: '987654321'
        });
        const dinerId = dinerRes.data.user.id;
        console.log(`Diner created with ID: ${dinerId}`);

        // 5. Diner Fetches Menus
        console.log('Fetching menus...');
        const menusRes = await axios.get(`${BASE_URL}/menus`);
        const foundMenu = menusRes.data.find((m: any) => m.id === menuId);
        if (foundMenu) {
            console.log('Menu found in list.');
        } else {
            console.error('Menu NOT found in list!');
            process.exit(1);
        }

        // 6. Create a Booking
        console.log('Creating booking...');
        const bookingDate = new Date();
        bookingDate.setDate(bookingDate.getDate() + 7); // 1 week from now
        
        await axios.post(`${BASE_URL}/bookings`, {
            user_id: dinerId,
            menu_id: menuId,
            chef_id: chefId,
            date_time: bookingDate.toISOString()
        });
        console.log('Booking created.');

        // 7. Verify Booking
        console.log('Verifying booking...');
        const bookingsRes = await axios.get(`${BASE_URL}/bookings?user_id=${dinerId}&role_id=2`);
        if (bookingsRes.data.length > 0 && bookingsRes.data[0].menu_id === menuId) {
            console.log('Booking verified successfully!');
        } else {
            console.error('Booking NOT found!');
            process.exit(1);
        }

        console.log('ALL TESTS PASSED.');

    } catch (error: any) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
    } finally {
        process.exit(0);
    }
};


runTest();
