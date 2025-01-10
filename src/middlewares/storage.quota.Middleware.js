const checkStorageQuota = async (req, res, next) => {
    const userId = req.user.id;
    const fileSize = req.file.size;
  
    try {
      const [usage] = await db.execute(
        `SELECT used_storage, plan_limit FROM storage_usage WHERE user_id = ?`,
        [userId]
      );
  
      if (usage[0].used_storage + fileSize > usage[0].plan_limit) {
        return res.status(403).json({ error: 'Storage quota exceeded' });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  