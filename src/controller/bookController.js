const flights = require('../repository/flightList');
// 항공편 예약 데이터를 저장합니다.
let booking = [];

function sanitizeBooking(entry) {
  const { book_id, ...rest } = entry;
  return rest;
}

module.exports = {
  // [GET] /book 요청을 수행합니다.
  // 전체 데이터 혹은 요청 된 flight_uuid, phone 값과 동일한 예약 데이터를 조회합니다.
  findById: (req, res) => {
    const { flight_uuid, phone } = req.query;

    if (phone) {
      // phone 있을 때 단일 객체 반환
      const one = booking.find(b => b.phone === phone);
      if (!one) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(sanitizeBooking(one));
    }

    // phone 없으면 flight_uuid 조건 필터링 + 배열 반환
    let result = booking;
    if (flight_uuid) {
      result = result.filter(b => b.flight_uuid === flight_uuid);
    }
    return res.status(200).json(result.map(sanitizeBooking));
  },

      

  // [POST] /book 요청을 수행합니다.
  // 요청 된 예약 데이터를 저장합니다.
  // 응답으로는 book_id를 리턴합니다.
  // Location Header로 예약 아이디를 함께 보내준다면 RESTful한 응답에 더욱 적합합니다.
  // 참고 링크: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#useful-post-responses
  create: (req, res) => {
    const { flight_uuid, name, phone } = req.body;
    if (!flight_uuid || !name || !phone) {
      return res
        .status(400)
        .json({ error: "flight_uuid, name, phone은 필수입니다." });
    }

    const book_id = Date.now().toString() + Math.floor(Math.random() * 1000);
    const reservation = { book_id, flight_uuid, name, phone };
    booking.push(reservation);

    res.status(201)
      .set("Location", `/book/${book_id}`)
      .json({ book_id });
  },

  // [DELETE] /book?phone={phone} 요청을 수행합니다.
  // 요청 된 phone 값과 동일한 예약 데이터를 삭제합니다.
  deleteById: (req, res) => {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: "phone 쿼리가 필요합니다." });
    }

    booking = booking.filter(b => b.phone !== phone);
    return res.status(200).json(booking.map(sanitizeBooking));
  },
};