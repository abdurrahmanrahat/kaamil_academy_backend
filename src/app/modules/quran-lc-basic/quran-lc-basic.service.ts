import QueryBuilder from '../../builder/QueryBuilder';
import { sendMessageToUserNumber } from '../../utils/sendMessageToUserNumber';
import { quranLCBasicSearchableFields } from './quran-lc-basic.constants';
import { TQuranLCBasic } from './quran-lc-basic.interface';
import { QuranLCBasic } from './quran-lc-basic.model';

// post
const createQuranLCBasicIntoDb = async (userInfo: TQuranLCBasic) => {
  const result = await QuranLCBasic.create(userInfo);
  return result;
};

// get
const getQuranLCBasicsFromDb = async (query: Record<string, unknown>) => {
  const QuranLCBasicQuery = new QueryBuilder(
    QuranLCBasic.find({ isDeleted: false }),
    query,
  )
    .search(quranLCBasicSearchableFields)
    .filter()
    .pagination();

  const data = await QuranLCBasicQuery.modelQuery;

  const quranLCBasicQueryWithoutPagination = new QueryBuilder(
    QuranLCBasic.find({ isDeleted: false }),
    query,
  )
    .search(quranLCBasicSearchableFields)
    .filter();

  const document = await quranLCBasicQueryWithoutPagination.modelQuery;
  const totalCount = document?.length;
  return { data, totalCount };
};

// update
const updateQuranLCBasicsIntoDb = async (
  studentId: string,
  body: Partial<TQuranLCBasic>,
) => {
  const result = await QuranLCBasic.findOneAndUpdate({ _id: studentId }, body, {
    new: true,
  });

  if (result && body.status === 'completed') {
    // send message
    const message = `অভিনন্দন! 🎉
আপনার কুরআন কোর্সে রেজিস্ট্রেশন সম্পন্ন হয়েছে।
হোয়াটসঅ্যাপ গ্রুপে যোগ দিন 👉 ${
      result.userGender === 'male'
        ? 'https://url-shortener.me/71QE'
        : 'https://url-shortener.me/71PZ'
    }`;

    await sendMessageToUserNumber({
      phone: result.phoneNumber,
      message,
    });
  }

  return result;
};

// delete
const deleteQuranLCBasicIntoDb = async (studentId: string) => {
  const result = await QuranLCBasic.findByIdAndUpdate(
    studentId,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

// const makePdfQuranLCBasicsFromDb = async (res) => {
//   try {
//     // ✅ Fetch data before setting headers
//     const data = await QuranLCBasic.find();

//     if (!data.length) {
//       return res
//         .status(404)
//         .json({ message: 'No users found in the database.' });
//     }

//     // ✅ Set response headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

//     const doc = new PDFDocument();
//     doc.pipe(res);

//     // ✅ Use Noto Sans Bengali from node_modules
//     const banglaFontPath = path.join(
//       process.cwd(),
//       'node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-latin-400-normal.woff',
//     );

//     doc.font(banglaFontPath);

//     // Title in Bangla
//     doc
//       .fontSize(16)
//       .text('কুরআন লার্নিং সেশন শিক্ষার্থীরা', { align: 'center' });
//     doc.moveDown();

//     // List users (Bangla names will now display correctly)
//     data.forEach((item, index) => {
//       doc.text(`${index + 1}. ${item.userName}`);
//     });

//     doc.end();
//   } catch (error) {
//     console.error('Error generating PDF:', error);

//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Error generating PDF', error });
//     }
//   }
// };

export const QuranLCBasicServices = {
  createQuranLCBasicIntoDb,
  getQuranLCBasicsFromDb,
  updateQuranLCBasicsIntoDb,
  deleteQuranLCBasicIntoDb,
};
