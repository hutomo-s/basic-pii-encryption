const puppeteer = require('puppeteer')
const crypto = require('crypto')
const fs = require('fs')
const constants = {
  alreadyExistAbsenMasuk: 'Anda sudah absen masuk!',
  alreadyExistAbsenKeluar: 'Anda sudah absen keluar!',
  success: 'Data absensi masuk sudah tersimpan!',
  confirmation: 'Apakah yakin akan selesai menggunakan aplikasi?'
};

const decrypt = ((encrypted) => {

    let key = ''
    let iv = ''

    try {
        key = fs.readFileSync('key.txt')
        iv = fs.readFileSync('iv.txt')
    } catch (err) {
        console.error(err)
    }

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    return (decrypted + decipher.final('utf8'))
})

const url = decrypt('LKEHrlFyhA2m5AgBU1rW7Kg49WLLMIuWDa4uqaCXUuF/kr2Y1lafPloB0A8/WRIJ');
const username = '712';
const password = decrypt('ZwOUpZgwqoYIoFYnezY9IA==');

const main = async () => {

    console.log("Process Start")

    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto(url, { waitUntil : 'networkidle0' })

    // dialog / alert handler
    page.on('dialog', async (dialog) => {

        console.log(dialog.type(), dialog.message())

        if (dialog.message() === constants.confirmation) {
            await dialog.accept();
        }
        if (dialog.message() === constants.success) {
            await dialog.accept();
        }
        if (dialog.message() === constants.alreadyExistAbsenMasuk) {
            await dialog.accept();
        }
        if (dialog.message() === constants.alreadyExistAbsenKeluar) {
            await dialog.accept();
        }
    })

    await login(page, username, password)

    await absenMasuk(page)

    await logout(page)

    await browser.close()

    console.log("Process Finish")
}

const login = async (page, username, password) => {
    
    // input username and password and click login
    await page.evaluate((username, password) => {
        document.querySelector('input[name="dataLogin"]').value = username
        document.querySelector('input[name="dataPass"').value = password
        document.querySelector('input[name="btnLogin"').click()
    }, username, password)
    await page.waitForSelector('a[class="mainMenu"]', {
        visible: true,
    })
}

const absenMasuk = async (page) => {
    // absensi
    await page.evaluateHandle(() => {
        const mainMenus = document.querySelectorAll('a[class="mainMenu"]')
        const menuItems = document.querySelectorAll('a[class="menuItem"]')


        // absensi masuk
        mainMenus[1].click();
        menuItems[4].click();
    });
    await page.waitForSelector('a[class="mainMenu"]', {
        visible: true,
    });

    console.log("Absen Masuk Finish")
}

const absenKeluar = async (page) => {
    // absensi
    await page.evaluateHandle(() => {
        const mainMenus = document.querySelectorAll('a[class="mainMenu"]')
        const menuItems = document.querySelectorAll('a[class="menuItem"]')

        // absensi keluar
        mainMenus[1].click();
        menuItems[5].click();
    });
    await page.waitForSelector('a[class="mainMenu"]', {
        visible: true,
    });

    console.log("Absen Keluar Finish")
}

const logout = async (page) => {
    await page.evaluateHandle(() => {
        const mainMenus = document.querySelectorAll('a[class="mainMenu"]')
        const menuItems = document.querySelectorAll('a[class="menuItem"]')
        
        mainMenus[0].click();
        menuItems[3].click();
    });
    await page.waitForSelector('input[name="btnLogin"', {
        visible: true,
    });
}

main()